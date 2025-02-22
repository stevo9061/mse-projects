// https://docs.mendix.com/apidocs-mxsdk/mxsdk/?_gl=1*1f4kxe4*_gcl_au*MTEzNzQxNDQyMC4xNzM1NTU2NDMw#2-2-mendix-model-sdk
// https://medium.com/@himanshuagarwal1395/setting-up-environment-variables-in-macos-sierra-f5978369b255
// https://www.mendix.com/evaluation-guide/enterprise-capabilities/openness-extensibility/openness-api-sdk/


import { IModel, microflows, pages, IStructure } from "mendixmodelsdk";
import { MendixPlatformClient } from "mendixplatformsdk";
import * as fs from "fs";

function logToFile(message: string) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync("usecase2-log.txt", `[${timestamp}] ${message}\n`);
}

console.log = (message?: any, ...optionalParams: any[]) => {
    const formattedMessage = `${message} ${optionalParams.join(" ")}`;
    logToFile(formattedMessage);
};

async function main() { 

    console.log("Starte Main-Funktion...");
    const client = new MendixPlatformClient();
    const app = await client.getApp("33653cf8-d242-4d6d-8548-c09dde9c0ead");
    const workingCopy = await app.createTemporaryWorkingCopy("main");
    const model = await workingCopy.openModel();

  // await collectAllMicroflows(model);
  const usedMicroflows = await findUsedMicroflows(model);
  const microflowsCC = calculateComplexityForMicroflows(usedMicroflows);

 // const usedNanoflows = await findUsedNanoflows(model);
 // const nanoflowCC = await calculateComplexityForNanoflows(usedNanoflows);

//  const essentialFlows = await findEssentialFlows(model);

//  await countAllWidgets(model);
//  await countUsedWidgets(model);
//  countWidgetsIncludingSnippets(model, "LoginPage");
//  countWidgetsIncludingSnippets(model, "Step1_ForgotPassword");
//    countWidgetsIncludingSnippets(model, "Step1_SignupEnterInfo");
// countWidgetsIncludingSnippets(model, "Login_Web_Button");
}

async function collectAllMicroflows(model: IModel) {
    const allMicroflows = model.allMicroflows();
    console.log(`Anzahl der Microflows in der App: ${allMicroflows.length}`);
/*     allMicroflows.forEach(mf => {
        console.log(`Microflow-Name: ${mf.name}`);
    }) */;
}

//TODO: Wie kann ich find references hier entfernen
async function findUsedMicroflows(model: IModel): Promise<microflows.IMicroflow[]> {
    const allMicroflows = model.allMicroflows();
    console.log(`Anzahl aller Microflows im Modell: ${allMicroflows.length}`);
    const usedMicroflows: microflows.IMicroflow[] = [];
    
    for (const mf of allMicroflows) {
        console.log(`Verarbeite Microflow: ${mf.name}`);
        
        const loadedMicroflow = await mf.load();
        if (!loadedMicroflow) {
            console.log(`Fehler beim Laden von Microflow: ${mf.name}`);
            continue;
        }
        
        const references = await findReferences(model, loadedMicroflow);
        console.log(`Referenzen für ${mf.name}: ${references.length}`);
        
        if (references.length > 0) {
            usedMicroflows.push(mf);
        }
    }
    
    console.log(`Anzahl der verwendeten Microflows: ${usedMicroflows.length}`);
    usedMicroflows.forEach(mf => {
        console.log(`Verwendeter Microflow: ${mf.name}`);
    });

    return usedMicroflows;
}
/*    async function findUsedMicroflows(model: IModel): Promise<microflows.IMicroflow[]> {
        const allMicroflows = model.allMicroflows();
        console.log(`Anzahl aller Microflows im Modell: ${allMicroflows.length}`);
        const usedMicroflows: microflows.IMicroflow[] = [];
        
        for (const mf of allMicroflows) {
            console.log(`Verarbeite Microflow: ${mf.name}`);
            
            const loadedMicroflow = await mf.load();
            if (!loadedMicroflow) {
                console.log(`Fehler beim Laden von Microflow: ${mf.name}`);
                continue;
            }
            
            // Anstelle von findReferences gib ein Dummy-Array zurück
            // const references = await findReferences(model, loadedMicroflow);
            const references = []; // Dummy-Array
            
            console.log(`Referenzen für ${mf.name}: ${references.length}`);
            
            if (references.length > 0) {
                usedMicroflows.push(mf);
            }
        }
        
        console.log(`Anzahl der verwendeten Microflows: ${usedMicroflows.length}`);
        usedMicroflows.forEach(mf => {
            console.log(`Verwendeter Microflow: ${mf.name}`);
        });
    
        return usedMicroflows;
    }
*/


// Verwendete Nanoflows finden
async function findUsedNanoflows(model: IModel): Promise<microflows.INanoflow[]> {
    const allNanoflows = model.allNanoflows();
    const usedNanoflows: microflows.INanoflow[] = [];

    for (const nf of allNanoflows) {
        const loadedNanoflow = await nf.load();
        const references = await findReferencesForNanoflow(model, loadedNanoflow);
        if (references.length > 0) {
            usedNanoflows.push(nf);
        }
    }

    console.log(`Anzahl der verwendeten Nanoflows: ${usedNanoflows.length}`);
    return usedNanoflows;
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
    console.log(`Gesamte Cyclomatic Complexity aller Microflows: ${totalComplexity}`);
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

    console.log(`Gesamte Cyclomatic Complexity aller Nanoflows: ${totalComplexity}`);

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


async function countAllWidgets(model: IModel) {
    const allPages = model.allPages();
    const allUsedPages: microflows.IMicroflow[] = [];
    let totalWidgets = 0;

    for (const page of allPages) {
        const loadedPage = await page.load();
        let widgetCount = 0;

        loadedPage.traverse((structure) => {
            if (structure instanceof pages.Widget) {
                widgetCount++;
            }
        });

    //    console.log(`Seite "${loadedPage.name}" enthält ${widgetCount} Widgets.`);
        totalWidgets += widgetCount;
    }

    console.log(`Gesamtanzahl aller Widgets in allen Seiten die gefunden werden konnten: ${totalWidgets}`);
}

/* async function countUsedWidgets(model: IModel) {
    const allPages = model.allPages();
    console.log(`Gesamtanzahl der Seiten: ${allPages.length}`);
    let totalWidgets = 0;

    for (const page of allPages) {
        try {
            const loadedPage = await page.load();
            if (!loadedPage) {
                console.error(`Seite konnte nicht geladen werden: ${page.id}`);
                continue;
            }
            console.log(`Geladene Seite: ${loadedPage.name}`);

            let widgetCount = 0;
            loadedPage.traverse((structure) => {
                if (structure instanceof pages.Widget) {
//                    console.log(`Widget gefunden: ${structure.structureTypeName}`);
                    widgetCount++;
                }
            });

            console.log(`Seite "${loadedPage.name}" enthält ${widgetCount} Widgets.`);
            totalWidgets += widgetCount;
        } catch (err) {
            console.error(`Fehler beim Laden der Seite ${page.id}:`, err);
        }
    }

    console.log(`Gesamtanzahl der verwendeten Widgets: ${totalWidgets}`);
} */

async function countWidgetsIncludingSnippets(model: IModel, pageName: string) {
    const allPages = model.allPages();
    let totalWidgetCount = 0;

    for (const page of allPages) {
        const loadedPage = await page.load();
        if (loadedPage.name === pageName) {
            console.log(`Untersuche Seite: ${loadedPage.name}`);
            
            // Starte die vollständige Zählung der Widgets
            totalWidgetCount = await traverseAndCountWidgetsIncludingSnippets(loadedPage, model);

            // Ausgabe der Gesamtanzahl nach Abschluss der Zählung
            console.log(`Seite "${pageName}" enthält insgesamt ${totalWidgetCount} Widgets (inklusive Snippets).`);
            return; // Beenden, wenn die Seite gefunden wurde
        }
    }

    console.log(`Seite "${pageName}" nicht gefunden.`);
}

async function traverseAndCountWidgetsIncludingSnippets(structure: IStructure, model: IModel): Promise<number> {
    let widgetCount = 0;
    const promises: Promise<void>[] = []; // Liste, um asynchrone Operationen zu verfolgen

    // Traverse die Struktur asynchron
    await structure.traverse((subStructure) => {
        // Direkt Widget zählen
        if (subStructure instanceof pages.Widget) {
            console.log(`Widget erkannt: ${subStructure.structureTypeName}`);
            widgetCount++;
        }

        // Falls ein SnippetCallWidget gefunden wird, lade und zähle die Widgets darin
        if (subStructure instanceof pages.SnippetCallWidget) {
            console.log(`SnippetCallWidget gefunden, lade zugehöriges Snippet.`);
            const snippetRef = subStructure.snippetCall?.snippet;
            if (snippetRef) {
                const snippetPromise = snippetRef.load().then(async (snippet) => {
                    if (snippet) {
                        console.log(`Snippet "${snippet.name}" wird traversiert.`);
                        const snippetWidgetCount = await traverseAndCountWidgetsIncludingSnippets(snippet, model);
                        widgetCount += snippetWidgetCount; // Addiere Widgets aus dem Snippet
                    }
                });
                promises.push(snippetPromise); // Füge die Operation der Liste hinzu
            }
        }
    });

    // Warte auf alle asynchronen Traversierungen (z. B. das Laden von Snippets)
    await Promise.all(promises);

    return widgetCount; // Gib die Gesamtanzahl zurück
}

function checkMenuItems(menuItems: any[], pageId: string): boolean {
    console.log(`Prüfe Menüeinträge: ${menuItems.length}`);
    for (const item of menuItems) {
        console.log(`Überprüfe Menüelement: ${JSON.stringify(item, null, 2)}`);
        if (item.action?.pageSettings?.page === pageId) {
            console.log(`Seite "${pageId}" in Menü gefunden.`);
            return true;
        }
        if (item.items && checkMenuItems(item.items, pageId)) {
            console.log(`Seite "${pageId}" in Untermenü gefunden.`);
            return true;
        }
    }
    return false; // Keine Referenz gefunden
}

async function isPageUsedInNavigation(model: IModel, page: pages.Page): Promise<boolean> {
    const navigationDocs = model.allNavigationDocuments();
    console.log(`Anzahl der Navigationsdokumente: ${navigationDocs.length}`);

    for (const navDoc of navigationDocs) {
        const loadedNavDoc = await navDoc.load();
        console.log(`Navigationsdokument geladen: ${JSON.stringify(loadedNavDoc, null, 2)}`);

        for (const profile of loadedNavDoc.profiles) {
            console.log(`Navigationsprofil: ${JSON.stringify(profile, null, 2)}`); // Debugging-Profil
            console.log(`Überprüfe Profil: ${profile.name}`);
            
            // Prüfen, ob die Seite die Startseite ist
            if ("homePage" in profile) {
                const homePageProfile = profile as any;
                console.log(`Homepage für Profil: ${JSON.stringify(homePageProfile.homePage, null, 2)}`); // Debugging-Homepage
                if (homePageProfile.homePage?.page === page.name) {
                    console.log(`Seite "${page.name}" ist die Startseite.`);
                    return true;
                }
            }

            // Prüfen, ob die Seite in rollenbasierten Homepages ist
            if ("roleBasedHomePages" in profile) {
                const roleBasedProfile = profile as any;
                for (const roleBasedHomePage of roleBasedProfile.roleBasedHomePages || []) {
                    console.log(`Überprüfe rollenbasierte Homepage: ${JSON.stringify(roleBasedHomePage, null, 2)}`); // Debugging rollenbasierte Homepage
                    if (roleBasedHomePage.page === page.name) {
                        console.log(`Seite "${page.name}" ist eine rollenbasierte Startseite.`);
                        return true;
                    }
                }
            }

            // Prüfen, ob die Seite in der Menüstruktur referenziert ist
            if ("menuItemCollection" in profile) {
                const menuProfile = profile as any;
                console.log(`Menüeinträge: ${JSON.stringify(menuProfile.menuItemCollection.items, null, 2)}`); // Debugging-Menü
                const isReferenced = checkMenuItems(menuProfile.menuItemCollection.items || [], page.name);
                if (isReferenced) {
                    console.log(`Seite "${page.name}" wird in der Menüstruktur verwendet.`);
                    return true;
                }
            }
        }
    }

    return false; // Seite wird nicht verwendet
}

    
function isPageReferencedInNavigation(items: any[], pageId: string): boolean {
    for (const item of items) {
        // Prüfen, ob das Element eine Aktion enthält, die auf die Seite verweist
        if (item.action?.page?.id === pageId) {
            return true; // Seite gefunden
        }

        // Prüfen, ob das Element Unterelemente hat und rekursiv suchen
        if (item.items && isPageReferencedInNavigation(item.items, pageId)) {
            return true;
        }
    }
    return false;
}

// Referenzen einer Seite in Layouts und anderen Seiten finden
async function findPageReferences(model: IModel, page: pages.Page): Promise<any[]> {
    const references: any[] = [];
    const allLayouts = model.allLayouts();

    console.log(`Anzahl der Layouts: ${allLayouts.length}`);

    for (const layout of allLayouts) {
        const loadedLayout = await layout.load();
        console.log(`Lade Layout: ${loadedLayout.name}`);
        loadedLayout.traverse((structure) => {
            if (
                structure instanceof microflows.ShowPageAction &&
                structure.pageSettings.page?.id === page.id
            ) {
                console.log(`Seite "${page.name}" in Layout referenziert.`);
                references.push(structure);
            }
        });
    }

    const allPages = model.allPages();
    for (const otherPage of allPages) {
        const loadedOtherPage = await otherPage.load();
        console.log(`Lade andere Seite: ${loadedOtherPage.name}`);
        loadedOtherPage.traverse((structure) => {
            if (
                structure instanceof microflows.ShowPageAction &&
                structure.pageSettings.page?.id === page.id
            ) {
                console.log(`Seite "${page.name}" durch andere Seite referenziert.`);
                references.push(structure);
            }
        });
    }

    return references;
}

async function findReferences(model: IModel, microflow: microflows.Microflow): Promise<any[]> {
    const references: any[] = [];
    const allPages = model.allPages();

    console.log(`Starte Suche nach Referenzen für Microflow: ${microflow.name} (${microflow.id})`);
    console.log(`Anzahl aller Seiten im Modell: ${allPages.length}`);

    // Suche in Seiten
    for (const page of allPages) {
        console.log(`Prüfe Seite: ${page.name}`);
        if (page.isLoaded) {
            const layout = await page.layoutCall?.layout?.load();
            console.log(`Layout der Seite ${page.name}:`, layout?.name);

            const widgets = layout?.widgets || [];
            for (const widget of widgets) {
                            if (
                                widget instanceof pages.ActionButton &&
                                widget.action instanceof pages.MicroflowClientAction &&
                                widget.action.microflowSettings.microflow?.id === microflow.id
                            ) {
                                console.log(`Gefundene Referenz im Widget: ${widget.structureTypeName} auf Seite ${page.name}`);
                                references.push(widget);
                            }
                        }
        } else {
            console.log(`Seite ${page.name} ist nicht geladen.`);
        }
    }

    console.log(`Suche in Seiten abgeschlossen. Gefundene Referenzen: ${references.length}`);

    // Suche in Microflows
    const allMicroflows = model.allMicroflows();
    console.log(`Anzahl aller Microflows im Modell: ${allMicroflows.length}`);

    for (const mf of allMicroflows) {
        console.log(`Prüfe Microflow: ${mf.name}`);
        const loadedMf = await mf.load();

        if (loadedMf.objectCollection) {
            console.log(`Microflow ${mf.name} hat eine ObjectCollection.`);
            const microflowObjects = loadedMf.objectCollection.objects || [];

            for (const obj of microflowObjects) {
                if (
                    obj instanceof microflows.ActionActivity &&
                    obj.action instanceof microflows.MicroflowCallAction &&
                    obj.action.microflowCall?.microflow?.id === microflow.id
                ) {
                    console.log(`Gefundene Referenz in Microflow-Aktion: ${obj.structureTypeName} in ${mf.name}`);
                    references.push(obj);
                }
            }
        } else {
            console.log(`Microflow ${mf.name} hat keine ObjectCollection.`);
        }
    }

    console.log(`Suche in Microflows abgeschlossen. Gefundene Referenzen: ${references.length}`);
    console.log(`Gesamtanzahl der Referenzen für ${microflow.name}: ${references.length}`);

    return references;
}

// Referenzen eines Nanoflows finden
async function findReferencesForNanoflow(model: IModel, nanoflow: microflows.Nanoflow): Promise<any[]> {
    const references: any[] = [];
    const allPages = model.allPages();

    for (const page of allPages) {
        const loadedPage = await page.load();
        loadedPage.traverse((structure) => {
            if (
                structure instanceof pages.ActionButton &&
                structure.action instanceof pages.CallNanoflowClientAction &&
                structure.action.nanoflow?.id === nanoflow.id
            ) {
                references.push(structure);
            }
        });
    }

    return references;
}

async function findEssentialFlows(
    model: IModel
): Promise<{ microflows: microflows.IMicroflow[]; nanoflows: microflows.INanoflow[] }> {
    const essentialMicroflows: microflows.IMicroflow[] = [];
    const essentialNanoflows: microflows.INanoflow[] = [];

    const allNavigationDocs = model.allNavigationDocuments();
    console.log(`Anzahl der Navigationsdokumente: ${allNavigationDocs.length}`);

    for (const navDoc of allNavigationDocs) {
        const loadedNavDoc = await navDoc.load();
        console.log(`Navigation geladen: ${JSON.stringify(loadedNavDoc, null, 2)}`);

        for (const profile of loadedNavDoc.profiles) {
            // Durchlaufe die Navigationseinträge
            console.log(`Navigationsprofil: ${JSON.stringify(profile, null, 2)}`);
            if ("homePage" in profile) {
                const homePage = (profile as any).homePage?.page;
                if (homePage) {
                    const references = await findMicroflowAndNanoflowReferencesInPage(model, homePage);
                    essentialMicroflows.push(...references.microflows);
                    essentialNanoflows.push(...references.nanoflows);
                }
            }

            // Prüfen, ob rollenbasierte Home-Seiten existieren
            if ("roleBasedHomePages" in profile) {
                const roleBasedHomePages = (profile as any).roleBasedHomePages || [];
                console.log(`Processing roleBasedHomePages: ${JSON.stringify(roleBasedHomePages, null, 2)}`);
            
                for (const rbHomePage of roleBasedHomePages) {
                    // 1) MICROFLOW
                    if (rbHomePage.microflow) {
                      // Logge, was du hast:
                      console.log(`Checking Microflow: ${rbHomePage.microflow.qualifiedName || rbHomePage.microflow}`);
                      
                      // Lade direkt diese Referenz:
                      const loadedMicroflow = await rbHomePage.microflow.load();
                      if (loadedMicroflow) {
                        console.log(`Found and loaded Microflow: ${loadedMicroflow.name}`);
                        essentialMicroflows.push(loadedMicroflow);
                      } else {
                        console.log(`Warnung: Microflow konnte nicht vollständig geladen werden.`);
                      }
                    }
                  
                    // 2) PAGE
                    if (rbHomePage.page) {
                      console.log(`Checking Page: ${rbHomePage.page.qualifiedName || rbHomePage.page}`);
                      const loadedPage = await rbHomePage.page.load();
                      if (!loadedPage) {
                        console.warn(`Warnung: Rolle: ${rbHomePage.userRole}, Page konnte nicht geladen werden.`);
                        continue;
                      }
                  
                      // Jetzt kannst du die geladene Seite traversieren:
                      // -> z.B. in einer eigenen Funktion:
                      const references = await collectReferencesFromLoadedPage(loadedPage);
                      essentialMicroflows.push(...references.microflows);
                      essentialNanoflows.push(...references.nanoflows);
                    }
                  }
            }

            // Menüeinträge prüfen
            if ("menuItemCollection" in profile) {
                const menuItems = (profile as any).menuItemCollection?.items || [];
                for (const item of menuItems) {
                    const references = await findMicroflowAndNanoflowReferencesInMenuItem(model, item);
                    essentialMicroflows.push(...references.microflows);
                    essentialNanoflows.push(...references.nanoflows);
                }
            }
        }
    }

    // Entferne Duplikate
    const uniqueMicroflows = Array.from(new Set(essentialMicroflows));
    const uniqueNanoflows = Array.from(new Set(essentialNanoflows));

   // **Hier Debugging für alle Microflows und Nanoflows einfügen**
   console.log("Alle verfügbaren Microflows:");
   model.allMicroflows().forEach((mf) => console.log(`- ${mf.qualifiedName}`));

   console.log("Alle verfügbaren Nanoflows:");
   model.allNanoflows().forEach((nf) => console.log(`- ${nf.qualifiedName}`));

   // Logge die gefundenen Microflows und Nanoflows
   console.log(`Gefundene Microflows (${uniqueMicroflows.length}):`);
   uniqueMicroflows.forEach((mf) => console.log(`- ${mf.name}`));

   console.log(`Gefundene Nanoflows (${uniqueNanoflows.length}):`);
   uniqueNanoflows.forEach((nf) => console.log(`- ${nf.name}`));


    return {
        microflows: uniqueMicroflows,
        nanoflows: uniqueNanoflows,
    };
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

async function findMicroflowAndNanoflowReferencesInMenuItem(
    model: IModel,
    menuItem: any
  ): Promise<{ microflows: microflows.IMicroflow[]; nanoflows: microflows.INanoflow[] }> {
      const microflowsUsed: microflows.IMicroflow[] = [];
      const nanoflowsUsed: microflows.INanoflow[] = [];
  
      console.log(`Untersuche Menüeintrag: ${JSON.stringify(menuItem, null, 2)}`);
  
      if (menuItem.action) {
          if (menuItem.action.microflow) {
              console.log(`Prüfe Microflow: ${menuItem.action.microflow}`);
              const microflowRef = model.allMicroflows().find(
                  (mf) => mf.qualifiedName === menuItem.action.microflow
              );
              if (microflowRef) {
                  console.log(`Microflow gefunden: ${microflowRef.name}`);
                  
                  // Hier konsequent await verwenden!
                  const loadedMicroflow = await safeLoad(microflowRef);
                  if (loadedMicroflow) {
                      console.log(`Microflow erfolgreich geladen: ${loadedMicroflow.name}`);
                      
                      // Jetzt ist exportLevel verfügbar
                      console.log(
                        `Export-Level: ${safeAccessMicroflowExportLevel(loadedMicroflow as microflows.Microflow)}`
                      );
                      microflowsUsed.push(loadedMicroflow);
                  } else {
                      console.log(`Fehler: Microflow "${microflowRef.qualifiedName}" konnte nicht vollständig geladen werden.`);
                  }
              } else {
                  console.log(`Warnung: Microflow "${menuItem.action.microflow}" konnte nicht aufgelöst werden.`);
              }
          }
  
          if (menuItem.action.pageSettings?.page) {
              const pageReferences = await findMicroflowAndNanoflowReferencesInPage(
                  model,
                  menuItem.action.pageSettings.page
              );
              microflowsUsed.push(...pageReferences.microflows);
              nanoflowsUsed.push(...pageReferences.nanoflows);
          }
      }
  
      // Rekursiv SubItems abarbeiten
      for (const subItem of menuItem.items || []) {
          const subReferences = await findMicroflowAndNanoflowReferencesInMenuItem(model, subItem);
          microflowsUsed.push(...subReferences.microflows);
          nanoflowsUsed.push(...subReferences.nanoflows);
      }
  
      return { microflows: microflowsUsed, nanoflows: nanoflowsUsed };
  }

  async function safeLoad<T extends { load(): Promise<T> }>(loadable: T): Promise<T | null> {
    try {
        const loadedObject = await loadable.load();
        return loadedObject;
    } catch (error) {
        console.error(`Fehler beim Laden eines Objekts:`, error);
        return null;
    }
}

function safeAccessMicroflowExportLevel(microflow: microflows.Microflow | null): string | null {
    if (!microflow) {
        console.error(`Microflow-Objekt ist null oder undefined.`);
        return null;
    }

    try {
        console.log(`Zugriff auf 'exportLevel' für Microflow: ${microflow.name}`);
        const level = microflow.exportLevel.toString();
        return level;
    } catch (error) {
        console.error(`Fehler beim Zugriff auf 'exportLevel':`, error);
        return null;
    }
}

async function collectReferencesFromLoadedPage(
    loadedPage: pages.Page
  ): Promise<{ microflows: microflows.IMicroflow[]; nanoflows: microflows.INanoflow[] }> {
  
    const microflowsUsed: microflows.IMicroflow[] = [];
    const nanoflowsUsed: microflows.INanoflow[] = [];
  
    // Hier sammeln wir asynchrone Ladevorgänge:
    const loadPromises: Promise<void>[] = [];
  
    // Alle Strukturen auf der Page durchlaufen
    loadedPage.traverse((structure) => {
      // Beispiel: ActionButton mit Microflow-Aktion
      if (
        structure instanceof pages.ActionButton &&
        structure.action instanceof pages.MicroflowClientAction &&
        structure.action.microflowSettings.microflow
      ) {
        const mfRef = structure.action.microflowSettings.microflow;
        loadPromises.push(
          (async () => {
            const loadedMf = await mfRef.load();
            microflowsUsed.push(loadedMf);
          })()
        );
      }
      // Beispiel: ActionButton mit Nanoflow-Aktion
      if (
        structure instanceof pages.ActionButton &&
        structure.action instanceof pages.CallNanoflowClientAction &&
        structure.action.nanoflow
      ) {
        const nfRef = structure.action.nanoflow;
        loadPromises.push(
          (async () => {
            const loadedNf = await nfRef.load();
            nanoflowsUsed.push(loadedNf);
          })()
        );
      }
  
      // Ggf. weitere Strukturen, bei denen Microflows/Nanoflows verwendet werden.
      // (OnChange, OnEnter, OnLeave, Events etc.)
    });
  
    // Auf alle Ladeoperationen warten
    await Promise.all(loadPromises);
  
    return { microflows: microflowsUsed, nanoflows: nanoflowsUsed };
  }

main().catch(console.error);

