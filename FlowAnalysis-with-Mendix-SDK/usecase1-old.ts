// https://docs.mendix.com/apidocs-mxsdk/mxsdk/?_gl=1*1f4kxe4*_gcl_au*MTEzNzQxNDQyMC4xNzM1NTU2NDMw#2-2-mendix-model-sdk
// https://medium.com/@himanshuagarwal1395/setting-up-environment-variables-in-macos-sierra-f5978369b255
// https://www.mendix.com/evaluation-guide/enterprise-capabilities/openness-extensibility/openness-api-sdk/

import { IModel, microflows, pages, IStructure } from "mendixmodelsdk";
import { MendixPlatformClient } from "mendixplatformsdk";
import * as fs from "fs";

function logToFile(message: string) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync("usecase1-log.txt", `[${timestamp}] ${message}\n`);
}

console.log = (message?: any, ...optionalParams: any[]) => {
    const formattedMessage = `${message} ${optionalParams.join(" ")}`;
    logToFile(formattedMessage);
};

async function main() { 

    console.log("Starte Main-Funktion...");
    const client = new MendixPlatformClient();
    const app = await client.getApp("7c43ad0e-fa7d-4495-b9e5-61737578894f");
    const workingCopy = await app.createTemporaryWorkingCopy("main");
    const model = await workingCopy.openModel();

  // await collectAllMicroflows(model);
  // const usedMicroflows = await findUsedMicroflows(model);
//  const microflowsCC = calculateComplexityForMicroflows(usedMicroflows);

  const modulename = "user_registration_and_login"; // Name des Moduls
  // const usedMicroflows2 = await findModuleMicroflows(model, modulename);
   const usedMicroflows3 = await findConnectedMicroflows(model, 'Nav_GuestHomePage');

   const snippetName = "ForgotPassword.LoginSnippet";
const targetSnippet = model.allSnippets().find(snippet => snippet.qualifiedName === snippetName);

if (!targetSnippet) {
    console.error(`Snippet "${snippetName}" wurde nicht gefunden.`);
    return;
}

const loadedSnippet = await targetSnippet.load();

const widgets: pages.Widget[] = [];
loadedSnippet.traverse((structure) => {
    if (structure instanceof pages.Widget) {
        widgets.push(structure);
    }
});

console.log(`Widgets im Snippet "${snippetName}":`, widgets.length);
// await processWidgets(widgets, `Snippet: ${snippetName}`);

  //console.log(`Insgesamt verwendete Microflows im Modul "${modulename}":`, usedMicroflows.length);
  //console.log(`Insgesamt verwendete Microflows im Modul "${modulename}":`, usedMicroflows2.length);
  console.log(`Insgesamt verwendete Microflows im Modul "${modulename}":`, usedMicroflows3.length);

  
//  const usedNanoflows = await findUsedNanoflows(model);
//  const nanoflowCC = await calculateComplexityForNanoflows(usedNanoflows);

//  const essentialFlows = await findEssentialFlows(model);

//  await countAllWidgets(model);
//  await countUsedWidgets(model);
//  countWidgetsIncludingSnippets(model, "LoginPage");
//  countWidgetsIncludingSnippets(model, "Step1_ForgotPassword");
//    countWidgetsIncludingSnippets(model, "Step1_SignupEnterInfo");
// countWidgetsIncludingSnippets(model, "Login_Web_Button");
}

async function findConnectedMicroflows(
    model: IModel,
    startMicroflowName: string
): Promise<microflows.IMicroflow[]> {
    const allMicroflows = model.allMicroflows();
    const allPages = model.allPages();
    const processedMicroflows: Set<string> = new Set(); // Verarbeitete Microflows
    const processedPages: Set<string> = new Set(); // Verarbeitete Seiten
    const processedSnippets: Set<string> = new Set(); // Verarbeitete Snippets
    const resultMicroflows: microflows.IMicroflow[] = []; // Endergebnis

    console.log(`Starte Suche nach verbundenen Microflows für "${startMicroflowName}"`);

    const startMicroflow = allMicroflows.find(mf => mf.name === startMicroflowName);
    if (!startMicroflow) {
        console.error(`Microflow "${startMicroflowName}" wurde nicht gefunden.`);
        return [];
    }

    // Funktionen wie processMicroflow, processPage, processSnippet werden hier verwendet...

    return resultMicroflows;

    async function processWidgets(widgets: pages.Widget[], context: string) {
        for (const widget of widgets) {
            console.log(`Widget: ${widget.structureTypeName}, Name: ${(widget as any).name || "N/A"}`);
    
            // Microflows direkt in Buttons verarbeiten
            if (
                widget instanceof pages.ActionButton &&
                widget.action instanceof pages.MicroflowClientAction &&
                widget.action.microflowSettings.microflow
            ) {
                const widgetMicroflow = widget.action.microflowSettings.microflow;
                console.log(`Gefundener Microflow "${widgetMicroflow.name}" in ${context}.`);
                await processMicroflow(widgetMicroflow);
            } else {
                console.log(`Widget "${widget.structureTypeName}" in ${context} enthält keine direkten Microflow-Verweise.`);
            }
    
            // Verarbeitung von Events
            if ('events' in widget) {
                const events = (widget as any).events || [];
                for (const event of events) {
                    if (
                        event.action instanceof pages.MicroflowClientAction &&
                        event.action.microflowSettings.microflow
                    ) {
                        const eventMicroflow = event.action.microflowSettings.microflow;
                        console.log(`Gefundener Microflow durch OnClick-Event "${eventMicroflow.name}" in ${context}.`);
                        await processMicroflow(eventMicroflow);
                    }
            
                    if (
                        event.action instanceof pages.PageClientAction &&
                        event.action.pageSettings?.page
                    ) {
                        const eventPage = event.action.pageSettings.page;
                        console.log(`Gefundene Seite durch OnClick-Event "${eventPage.name}" in ${context}.`);
                        await processPage(eventPage);
                    }
                }
            }
    
            // Verarbeitung von Snippet-Widgets
            if (widget instanceof pages.SnippetCallWidget && widget.snippetCall?.snippet) {
                const snippet = await widget.snippetCall.snippet.load();
                console.log(`Gefundenes Snippet "${snippet.name}" in ${context}.`);
                await processSnippet(snippet);
            } else {
                console.log(`Widget "${widget.structureTypeName}" in ${context} enthält kein referenziertes Snippet.`);
            }
        }
    }

async function processMicroflow(mf: microflows.IMicroflow) {
    // Überprüfen, ob der Microflow bereits verarbeitet wurde
    if (!mf || processedMicroflows.has(mf.id)) return;
    processedMicroflows.add(mf.id);

    console.log(`Verarbeite Microflow: ${mf.name}`);

    // Lade den vollständigen Microflow
    const loadedMf = await mf.load();
    resultMicroflows.push(mf);

    // Prüfen, ob der Microflow Aktivitäten (objectCollection) hat
    if (!loadedMf.objectCollection) return;

    // Alle Aktivitäten (Objekte) im Microflow durchlaufen
    const microflowObjects = loadedMf.objectCollection.objects || [];
    for (const obj of microflowObjects) {
        // Suche nach Microflow-Aufrufen
        if (obj instanceof microflows.ActionActivity && obj.action instanceof microflows.MicroflowCallAction) {
            const calledMicroflow = obj.action.microflowCall?.microflow;
            if (calledMicroflow) {
                console.log(`Microflow "${mf.name}" ruft Microflow "${calledMicroflow.name}" auf.`);
                await processMicroflow(calledMicroflow); // Rekursive Verarbeitung
            }
        }

        // Suche nach Seitenaufrufen
        if (obj instanceof microflows.ActionActivity && obj.action instanceof microflows.ShowPageAction) {
            const calledPage = obj.action.pageSettings.page;
            if (calledPage) {
                console.log(`Microflow "${mf.name}" ruft Seite "${calledPage.name}" auf.`);
                await processPage(calledPage); // Verarbeite die referenzierte Seite
            }
        }

        // Prüfe, ob ein Snippet verwendet wird
        // (Removed check for ShowSnippetAction as it does not exist)
    }
}

async function processPage(page: pages.IPage) {
    // Prüfen, ob die Seite bereits verarbeitet wurde
    if (!page || processedPages.has(page.id)) return;
    processedPages.add(page.id);

    console.log(`Betrete processPage für Seite: ${page.name}`);

    // Seite laden
    const loadedPage = await page.load();
    const widgets: pages.Widget[] = [];

    // Alle Widgets auf der Seite sammeln
    loadedPage.traverse((structure) => {
        if (structure instanceof pages.Widget) {
            widgets.push(structure);
        }
    });

    console.log(`Widgets auf Seite "${loadedPage.name}":`, widgets.map(w => w.structureTypeName).join(","));

    // Verarbeite die gefundenen Widgets
    await processWidgets(widgets, `Seite: ${loadedPage.name}`);
}

async function processSnippet(snippet: pages.Snippet) {
    if (!snippet || processedSnippets.has(snippet.id)) return;
    processedSnippets.add(snippet.id);

    const widgets: pages.Widget[] = [];
    snippet.traverse((structure) => {
        if (structure instanceof pages.Widget) {
            widgets.push(structure);
        }
    });

    console.log(`Widgets im Snippet "${snippet.name}":`, widgets.map(w => w.structureTypeName).join(", "));

    // Widgets im Snippet verarbeiten
    await processWidgets2(widgets, `Snippet: ${snippet.name}`);
}

async function processWidgets2(widgets: pages.Widget[], context: string) {
    for (const widget of widgets) {
        console.log(`Widget: ${widget.structureTypeName}, Name: ${(widget as any).name || "N/A"}`);

        // Microflows direkt in Buttons verarbeiten
        if (
            widget instanceof pages.ActionButton &&
            widget.action instanceof pages.MicroflowClientAction &&
            widget.action.microflowSettings.microflow
        ) {
            const widgetMicroflow = widget.action.microflowSettings.microflow;
            console.log(`Gefundener Microflow "${widgetMicroflow.name}" in ${context}.`);
            await processMicroflow(widgetMicroflow);
        }

        // Verarbeitung von `OnClick`-Events
        if ('events' in widget) {
            const events = (widget as any).events || [];
            for (const event of events) {
                if (
                    event.action instanceof pages.MicroflowClientAction &&
                    event.action.microflowSettings.microflow
                ) {
                    const eventMicroflow = event.action.microflowSettings.microflow;
                    console.log(`Gefundener Microflow durch OnClick-Event "${eventMicroflow.name}" in ${context}.`);
                    await processMicroflow(eventMicroflow);
                }

                if (
                    event.action instanceof pages.PageClientAction &&
                    event.action.pageSettings?.page
                ) {
                    const eventPage = event.action.pageSettings.page;
                    console.log(`Gefundene Seite durch OnClick-Event "${eventPage.name}" in ${context}.`);
                    await processPage(eventPage);
                }
            }
        }

        // Verarbeitung von Snippets
        if (widget instanceof pages.SnippetCallWidget && widget.snippetCall?.snippet) {
            const snippet = await widget.snippetCall.snippet.load();
            console.log(`Gefundenes Snippet "${snippet.name}" in ${context}.`);
            await processSnippet(snippet);
        }
    }
}



async function collectAllMicroflows(model: IModel) {
    const allMicroflows = model.allMicroflows();
    console.log(`Anzahl der Microflows in der App: ${allMicroflows.length}`);
/*     allMicroflows.forEach(mf => {
        console.log(`Microflow-Name: ${mf.name}`);
    }) */;
}

async function findUsedMicroflows(model: IModel): Promise<microflows.IMicroflow[]> {
    const allMicroflows = model.allMicroflows();
    const usedMicroflows: microflows.IMicroflow[] = [];
    for (const mf of allMicroflows) {
        const loadedMicroflow = await mf.load();
        const references = await findReferences(model, loadedMicroflow);
        if (references.length > 0) {
            usedMicroflows.push(mf);
        }
    }
    console.log(`Anzahl der verwendeten Microflows: ${usedMicroflows.length}`);
    usedMicroflows.forEach(mf => {
        console.log(`Verwendeter Microflow: ${mf.name}`);
    });

    return usedMicroflows.length > 0 ? usedMicroflows : [];
}

// Verwendete Nanoflows finden
/* async function findUsedNanoflows(model: IModel): Promise<microflows.INanoflow[]> {
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
} */

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
    for (const page of allPages) {
        if (page.isLoaded) {
            const layout = await page.layoutCall?.layout?.load();
            const widgets = layout?.widgets || [];
            for (const widget of widgets) {
                if (widget instanceof pages.ActionButton && widget.action instanceof pages.MicroflowClientAction && widget.action.microflowSettings.microflow?.id === microflow.id) {
                    references.push(widget);
                }
            }
        }
    }

    const allMicroflows = model.allMicroflows();
    for (const mf of allMicroflows) {
        const loadedMf = await mf.load();
        if (loadedMf.objectCollection) {
            const microflowObjects = loadedMf.objectCollection.objects || [];
            for (const obj of microflowObjects) {
                if (obj instanceof microflows.ActionActivity && obj.action instanceof microflows.MicroflowCallAction && obj.action.microflowCall?.microflow?.id === microflow.id) {
                    references.push(obj);
                }
            }
        }
    }

    return references;
}

async function findConnectedMicroflows(
    model: IModel,
    startMicroflowName: string
): Promise<microflows.IMicroflow[]> {
    const allMicroflows = model.allMicroflows();
    console.log(`Alle Microflows:`, allMicroflows.map(mf => mf.name));
    
    const processedMicroflows: Set<string> = new Set();
    const processedPages: Set<string> = new Set();
    const processedSnippets: Set<string> = new Set();
    const resultMicroflows: microflows.IMicroflow[] = [];

    console.log(`Starte Suche nach verbundenen Microflows für "${startMicroflowName}"`);

    const startMicroflow = allMicroflows.find(mf => mf.name === startMicroflowName);
    if (!startMicroflow) {
        console.error(`Microflow "${startMicroflowName}" wurde nicht gefunden.`);
        return [];
    }

    async function processMicroflow(mf: microflows.IMicroflow) {
        if (!mf || processedMicroflows.has(mf.id)) return;
        processedMicroflows.add(mf.id);

        console.log(`Verarbeite Microflow: ${mf.name}`);
        const loadedMf = await mf.load();
        resultMicroflows.push(mf);

        if (!loadedMf.objectCollection) return;
        const microflowObjects = loadedMf.objectCollection.objects || [];
        for (const obj of microflowObjects) {
            if (obj instanceof microflows.ActionActivity && obj.action instanceof microflows.MicroflowCallAction) {
                const calledMicroflow = obj.action.microflowCall?.microflow;
                if (calledMicroflow) {
                    console.log(`Microflow "${mf.name}" ruft Microflow "${calledMicroflow.name}" auf.`);
                    await processMicroflow(calledMicroflow);
                }
            }
            if (obj instanceof microflows.ActionActivity && obj.action instanceof microflows.ShowPageAction) {
                const calledPage = obj.action.pageSettings.page;
                if (calledPage) {
                    console.log(`Microflow "${mf.name}" ruft Seite "${calledPage.name}" auf.`);
                    await processPage(calledPage);
                }
            }
        }
    }

    async function processPage(page: pages.IPage) {
        if (!page || processedPages.has(page.id)) return;
        processedPages.add(page.id);

        console.log(`Betrete processPage für Seite: ${page.name}`);
        const loadedPage = await page.load();
        const layout = await loadedPage.layoutCall?.layout?.load();

        const widgets: pages.Widget[] = [];
        layout?.content?.traverse((structure) => {
            if (structure instanceof pages.Widget) {
                widgets.push(structure);
            }
        });

        console.log(`Widgets auf Seite "${loadedPage.name}":`, widgets.map(w => w.structureTypeName));
        await processWidgets(widgets, `Seite: ${loadedPage.name}`);
    }

    async function processWidgets(widgets: pages.Widget[], context: string) {
        console.log(`Verarbeite Widgets in ${context}`);
        for (const widget of widgets) {
            console.log(`Widget: ${widget.structureTypeName}, Name: ${(widget as any).name || "N/A"}`);
    
            // Microflows direkt in Buttons verarbeiten
            if (
                widget instanceof pages.ActionButton &&
                widget.action instanceof pages.MicroflowClientAction &&
                widget.action.microflowSettings.microflow
            ) {
                const widgetMicroflow = widget.action.microflowSettings.microflow;
                console.log(`Gefundener Microflow "${widgetMicroflow.name}" in ${context}.`);
                await processMicroflow(widgetMicroflow);
            }
    
            // Snippets in Placeholders verarbeiten
            if (widget instanceof pages.Placeholder) {
                console.log(`Placeholder gefunden: ${widget.name}`);
                const containedWidget = (widget as any).widget;
            
                if (!containedWidget) {
                    console.log(`Placeholder "${widget.name}" enthält kein Widget.`);
                } else {
                    console.log(`Placeholder "${widget.name}" enthält Widget vom Typ: ${containedWidget.structureTypeName}`);
                    
                    // Prüfen, ob es ein Snippet ist
                    if (containedWidget instanceof pages.SnippetCallWidget && containedWidget.snippetCall?.snippet) {
                        const snippet = await containedWidget.snippetCall.snippet.load();
                        console.log(`Gefundenes Snippet im Placeholder: ${snippet.name}`);
                        await processSnippet(snippet);
                    } else {
                        // Falls es kein Snippet ist, Widgets im Placeholder weiterverarbeiten
                        console.log(`Kein Snippet, sondern ein anderes Widget im Placeholder: ${containedWidget.structureTypeName}`);
                        await processWidgets([containedWidget], `Placeholder: ${widget.name}`);
                    }
                }
            }
    
            // Verarbeitung von Events
            if ('events' in widget) {
                const events = (widget as any).events || [];
                for (const event of events) {
                    if (
                        event.action instanceof pages.MicroflowClientAction &&
                        event.action.microflowSettings.microflow
                    ) {
                        const eventMicroflow = event.action.microflowSettings.microflow;
                        console.log(`Gefundener Microflow durch OnClick-Event "${eventMicroflow.name}" in ${context}.`);
                        await processMicroflow(eventMicroflow);
                    }
    
                    if (
                        event.action instanceof pages.PageClientAction &&
                        event.action.pageSettings?.page
                    ) {
                        const eventPage = event.action.pageSettings.page;
                        console.log(`Gefundene Seite durch OnClick-Event "${eventPage.name}" in ${context}.`);
                        await processPage(eventPage);
                    }
                }
            }
    
            // Verarbeitung von Snippet-Widgets
            if (widget instanceof pages.SnippetCallWidget && widget.snippetCall?.snippet) {
                const snippet = await widget.snippetCall.snippet.load();
                console.log(`Gefundenes Snippet "${snippet.name}" in ${context}.`);
                await processSnippet(snippet);
            }
        }
    }

    async function processSnippet(snippet: pages.Snippet) {
        if (!snippet || processedSnippets.has(snippet.id)) return;
        processedSnippets.add(snippet.id);

        console.log(`Betrete processSnippet für Snippet: ${snippet.name}`);
        const widgets: pages.Widget[] = [];
        snippet.traverse((structure) => {
            if (structure instanceof pages.Widget) {
                widgets.push(structure);
            }
        });

        console.log(`Widgets im Snippet "${snippet.name}":`, widgets.map(w => w.structureTypeName));
        await processWidgets(widgets, `Snippet: ${snippet.name}`);
    }

    await processMicroflow(startMicroflow);

    console.log(`Gefundene Microflows:`, resultMicroflows.map(mf => mf.name));
    return resultMicroflows;
}
}

main().catch(console.error);

