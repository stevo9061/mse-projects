// https://docs.mendix.com/apidocs-mxsdk/mxsdk/?_gl=1*1f4kxe4*_gcl_au*MTEzNzQxNDQyMC4xNzM1NTU2NDMw#2-2-mendix-model-sdk
// https://medium.com/@himanshuagarwal1395/setting-up-environment-variables-in-macos-sierra-f5978369b255
// https://www.mendix.com/evaluation-guide/enterprise-capabilities/openness-extensibility/openness-api-sdk/

import { IModel, microflows, pages, IStructure } from "mendixmodelsdk";
import { MendixPlatformClient } from "mendixplatformsdk";
import * as fs from "fs";


function logToFile(message: string) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync("usecase3-log.txt", `[${timestamp}] ${message}\n`);
}

console.log = (message?: any, ...optionalParams: any[]) => {
    const formattedMessage = `${message} ${optionalParams.join(" ")}`;
    logToFile(formattedMessage);
};

async function main() {
    const client = new MendixPlatformClient();
    const app = await client.getApp("463b8de2-64ad-4c57-a149-4f758388b0f8");
    const workingCopy = await app.createTemporaryWorkingCopy("main");
    const model = await workingCopy.openModel();

    const modulename = "TaskTracker";
    const usedMicroflowsTaskTracker = await findModuleMicroflows(model, modulename);
    const microflowsCC = calculateComplexityForMicroflows(usedMicroflowsTaskTracker);

    const usedNanoflowsTaskTracker = await findModuleNanoflows(model, modulename);
    const nanoflowCC = await calculateComplexityForNanoflows(usedNanoflowsTaskTracker);

}

async function calculateComplexityForMicroflows(usedMicroflows: microflows.IMicroflow[]) {
    console.log("Beginne mit der Berechnung der Cyclomatic Complexity...");
    let totalComplexity = 0;

    for (const mf of usedMicroflows) {
        const loadedMicroflow = await mf.load();
        const complexity = calculateCyclomaticComplexityMicroflows(loadedMicroflow);
        totalComplexity += complexity;

        console.log(`Microflow "${loadedMicroflow.name}" hat eine Cyclomatic Complexity von ${complexity}`);
    }
    console.log(`\nGesamte Cyclomatic Complexity aller Microflows: ${totalComplexity}\n`);
}

function calculateCyclomaticComplexityMicroflows(microflow: microflows.Microflow): number {
    const nodes = microflow.objectCollection?.objects.length || 0;
    const edges = microflow.flows?.length || 0;

    let conditions = 0; // Anzahl der Bedingungen (ExclusiveSplit)
    let loops = 0;      // Anzahl der Schleifen (LoopedActivity)

    microflow.objectCollection?.objects.forEach((obj) => {
        if (obj instanceof microflows.ExclusiveSplit) {
            // Bedingungen (If/Else)
            conditions++;
        }
        if (obj instanceof microflows.LoopedActivity) {
            // Schleifen
            loops++;
        }
    });

    // Cyclomatic Complexity = (E - N) 1 + 2 + Bedingungen + Schleifen
    const complexity = 1 + conditions + loops;

    // Sicherstellen, dass die CC mindestens 1 ist
    return Math.max(1, complexity);
}

// Cyclomatic Complexity für Nanoflows berechnen
async function calculateComplexityForNanoflows(usedNanoflows: microflows.INanoflow[]): Promise<number> {
    let totalComplexity = 0;

    for (const nf of usedNanoflows) {
        const loadedNanoflow = await nf.load();
        const complexity = calculateCyclomaticComplexityNanoflows(loadedNanoflow);
        totalComplexity += complexity;

        console.log(`Nanoflow "${loadedNanoflow.name}" hat eine Cyclomatic Complexity von ${complexity}`);
    }

    console.log(`\nGesamte Cyclomatic Complexity aller Nanoflows: ${totalComplexity}\n`);

    return totalComplexity;
}

// Cyclomatic Complexity für einen Flow berechnen
function calculateCyclomaticComplexityNanoflows(flow: microflows.Microflow | microflows.Nanoflow): number {
    let conditions = 0;
    let loops = 0;

    flow.objectCollection?.objects.forEach((obj) => {
        if (obj instanceof microflows.ExclusiveSplit) {
            conditions++;
        }
        if (obj instanceof microflows.LoopedActivity) {
            loops++;
        }
    });

    // CC = 1 + Anzahl der Bedingungen + Anzahl der Schleifen
    return 1 + conditions + loops;
}

async function findMicroflowAndNanoflowReferencesInPage(
    model: IModel,
    pageRef: pages.IPage
): Promise<{ microflows: microflows.IMicroflow[]; nanoflows: microflows.INanoflow[] }> {

    const microflowsUsed: microflows.IMicroflow[] = [];
    const nanoflowsUsed: microflows.INanoflow[] = [];
    const loadPromises: Promise<void>[] = [];

    // Einfach die Page laden:
    const loadedPage = await pageRef.load();
    if (!loadedPage) {
        console.warn(`Seite konnte nicht geladen werden.`);
        return { microflows: [], nanoflows: [] };
    }

    console.log(`Untersuche geladene Seite: ${loadedPage.name}`);

    // Wie gehabt: traverse + Microflow/Nanoflow laden
    loadedPage.traverse((structure) => {
        if (
            structure instanceof pages.ActionButton &&
            structure.action instanceof pages.MicroflowClientAction &&
            structure.action.microflowSettings.microflow
        ) {
            const mfRef = structure.action.microflowSettings.microflow;
            loadPromises.push(
                (async () => {
                    const loadedMf = await mfRef.load();
                    console.log(`Geladener Microflow: ${loadedMf.name}`);
                    microflowsUsed.push(loadedMf);
                })()
            );
        }

        if (
            structure instanceof pages.ActionButton &&
            structure.action instanceof pages.CallNanoflowClientAction &&
            structure.action.nanoflow
        ) {
            const nfRef = structure.action.nanoflow;
            loadPromises.push(
                (async () => {
                    const loadedNf = await nfRef.load();
                    console.log(`Geladener Nanoflow: ${loadedNf.name}`);
                    nanoflowsUsed.push(loadedNf);
                })()
            );
        }
    });

    // Auf alle Loads warten
    await Promise.all(loadPromises);

    return { microflows: microflowsUsed, nanoflows: nanoflowsUsed };
}

  async function findModuleMicroflows(model: IModel, modulename: string): Promise<microflows.IMicroflow[]> {
      const allMicroflows = model.allMicroflows();
      const allPages = model.allPages();
      const processedMicroflows: Set<string> = new Set(); // Verarbeitete Microflows
      const processedPages: Set<string> = new Set(); // Verarbeitete Seiten
      const resultMicroflows: microflows.IMicroflow[] = []; // Endergebnis
  
      console.log(`Starte Suche nach Microflows im Modul: ${modulename}`);
  
      // 1. Finde alle Microflows aus dem angegebenen Modul
      const moduleMicroflows = allMicroflows.filter(mf => mf.qualifiedName?.startsWith(modulename));
      console.log(`Gefundene Microflows im Modul "${modulename}": ${moduleMicroflows.length}`);
  
      // 2. Rekursive Funktion zum Verarbeiten von Microflows
      async function processMicroflow(mf: microflows.IMicroflow) {
          if (!mf || processedMicroflows.has(mf.id)) return; // Überspringe bereits verarbeitete Microflows
          processedMicroflows.add(mf.id);
  
          const loadedMf = await mf.load();
          if (!loadedMf.objectCollection) return;
  
          // Finde alle aufgerufenen Microflows und Seiten in diesem Microflow
          const microflowObjects = loadedMf.objectCollection.objects || [];
          for (const obj of microflowObjects) {
              // Microflow-Aufrufe
              if (obj instanceof microflows.ActionActivity && obj.action instanceof microflows.MicroflowCallAction) {
                  const calledMicroflow = obj.action.microflowCall?.microflow;
                  if (calledMicroflow) {
                      console.log(`Microflow "${mf.name}" ruft Microflow "${calledMicroflow.name}" auf.`);
                      resultMicroflows.push(calledMicroflow);
                      await processMicroflow(calledMicroflow); // Rekursiver Aufruf
                  }
              }
  
              // Seiten-Aufrufe
              if (obj instanceof microflows.ActionActivity && obj.action instanceof microflows.ShowPageAction) {
                  const calledPage = obj.action.pageSettings.page;
                  if (calledPage) {
                      console.log(`Microflow "${mf.name}" ruft Seite "${calledPage.name}" auf.`);
                      await processPage(calledPage); // Prozessiere die aufgerufene Seite
                  }
              }
          }
      }
  
          async function processPage(page: pages.IPage) {
            if (!page || processedPages.has(page.id)) return; // Überspringe bereits verarbeitete Seiten
            processedPages.add(page.id);
        
            console.log(`Betrete Seite: ${page.name}`);
            const loadedPage = await page.load();
        
            // Alle Widgets auf der Seite über Traversierung sammeln
            const widgets: pages.Widget[] = [];
            loadedPage.traverse((structure) => {
                if (structure instanceof pages.Widget) {
                    widgets.push(structure);
                }
            });
        
            console.log(`Widgets auf Seite "${loadedPage.name}": ${widgets.length}`);
        
            // Durchlaufe alle Widgets und verarbeite ActionButtons, die einen Microflow aufrufen
            for (const widget of widgets) {
                if (
                    widget instanceof pages.ActionButton &&
                    widget.action instanceof pages.MicroflowClientAction &&
                    widget.action.microflowSettings.microflow
                ) {
                    const pageMicroflow = widget.action.microflowSettings.microflow;
                    console.log(`Gefundener Microflow "${pageMicroflow.name}" auf Seite "${loadedPage.name}".`);
                    resultMicroflows.push(pageMicroflow);
                    await processMicroflow(pageMicroflow); // Rekursiver Aufruf für Microflows auf der Seite
                }
            }
        }


      // Verarbeite alle Modul-Microflows
      for (const mf of moduleMicroflows) {
          resultMicroflows.push(mf);
          await processMicroflow(mf);
      }
  
  // 4. Entferne Duplikate
      const uniqueMicroflows = Array.from(new Set(resultMicroflows.map(mf => mf.id)))
          .map(id => resultMicroflows.find(mf => mf.id === id))
          .filter((mf): mf is microflows.IMicroflow => mf !== undefined);
  
      console.log(`Gefundene eindeutige Microflows im Modul "${modulename}": ${uniqueMicroflows.length}`);
      uniqueMicroflows.forEach(mf => console.log(`Microflow: ${mf?.name}`));
  
      return uniqueMicroflows;
  }
  async function findModuleNanoflows(model: IModel, modulename: string): Promise<microflows.INanoflow[]> {
    const allNanoflows = model.allNanoflows();
    const processedNanoflows: Set<string> = new Set(); // Verarbeitete Nanoflows
    const processedPages: Set<string> = new Set();      // Verarbeitete Seiten
    const resultNanoflows: microflows.INanoflow[] = [];  // Endergebnis

    console.log(`Starte Suche nach Nanoflows im Modul: ${modulename}`);

    // 1. Finde alle Nanoflows aus dem angegebenen Modul
    const moduleNanoflows = allNanoflows.filter(nf => nf.qualifiedName?.startsWith(modulename));
    console.log(`Gefundene Nanoflows im Modul "${modulename}": ${moduleNanoflows.length}`);

    // 2. Rekursive Funktion zum Verarbeiten von Nanoflows
    async function processNanoflow(nf: microflows.INanoflow) {
        if (!nf || processedNanoflows.has(nf.id)) return; // Überspringe bereits verarbeitete Nanoflows
        processedNanoflows.add(nf.id);

        const loadedNf = await nf.load();
        if (!loadedNf.objectCollection) return;

        // Finde alle aufgerufenen Nanoflows und Seiten in diesem Nanoflow
        const nanoflowObjects = loadedNf.objectCollection.objects || [];
        for (const obj of nanoflowObjects) {
            // Nanoflow-Aufrufe
            if (obj instanceof microflows.ActionActivity && (obj.action as any).nanoflow) {
                const calledNanoflow = (obj.action as any).nanoflow as microflows.INanoflow;
                if (calledNanoflow) {
                    console.log(`Nanoflow "${nf.name}" ruft Nanoflow "${calledNanoflow.name}" auf.`);
                    resultNanoflows.push(calledNanoflow);
                    await processNanoflow(calledNanoflow); // Rekursiver Aufruf
                }
            }

            // Seiten-Aufrufe
            if (obj instanceof microflows.ActionActivity && obj.action instanceof microflows.ShowPageAction) {
                const calledPage = obj.action.pageSettings.page;
                if (calledPage) {
                    console.log(`Nanoflow "${nf.name}" ruft Seite "${calledPage.name}" auf.`);
                    await processPage(calledPage); // Prozessiere die aufgerufene Seite
                }
            }
        }
    }

    // Rekursive Funktion zum Verarbeiten von Seiten
    async function processPage(page: pages.IPage) {
        if (!page || processedPages.has(page.id)) return; // Überspringe bereits verarbeitete Seiten
        processedPages.add(page.id);

        console.log(`Betrete Seite: ${page.name}`);
        const loadedPage = await page.load();

        // Alle Widgets auf der Seite über Traversierung sammeln
        const widgets: pages.Widget[] = [];
        loadedPage.traverse((structure) => {
            if (structure instanceof pages.Widget) {
                widgets.push(structure);
            }
        });
        console.log(`Widgets auf Seite "${loadedPage.name}": ${widgets.length}`);

        // Durchlaufe alle Widgets und verarbeite ActionButtons, die einen Nanoflow aufrufen
        for (const widget of widgets) {
            if (
                widget instanceof pages.ActionButton &&
                widget.action instanceof pages.CallNanoflowClientAction &&
                widget.action.nanoflow
            ) {
                const widgetNanoflow = widget.action.nanoflow;
                console.log(`Gefundener Nanoflow "${widgetNanoflow.name}" auf Seite "${loadedPage.name}".`);
                resultNanoflows.push(widgetNanoflow);
                await processNanoflow(widgetNanoflow); // Rekursiver Aufruf für Nanoflows auf der Seite
            }
        }
    }

    // 3. Verarbeite alle Modul-Nanoflows
    for (const nf of moduleNanoflows) {
        resultNanoflows.push(nf);
        await processNanoflow(nf);
    }

    // 4. Entferne Duplikate (basierend auf der ID)
    const uniqueNanoflows = Array.from(new Set(resultNanoflows.map(nf => nf.id)))
        .map(id => resultNanoflows.find(nf => nf.id === id))
        .filter((nf): nf is microflows.INanoflow => nf !== undefined);

    console.log(`Gefundene eindeutige Nanoflows im Modul "${modulename}": ${uniqueNanoflows.length}`);
    uniqueNanoflows.forEach(nf => console.log(`Nanoflow: ${nf?.name}`));

    return uniqueNanoflows;
}


main().catch(console.error);

