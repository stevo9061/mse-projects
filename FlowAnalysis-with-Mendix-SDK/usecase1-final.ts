import { IModel, microflows, pages, javaactions, nanoflows, customwidgets, IStructure } from "mendixmodelsdk";
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

    const usedMicroflows = await findConnectedMicroflows(model, 'Nav_GuestHomePage');

    console.log(`Insgesamt gefundene Microflows insgesamt: ${usedMicroflows.length}`);
  //  usedMicroflows.forEach((mf) => console.log(`Microflow: ${mf.name}`));

    const microflowsInUseCC = await calculateComplexityForMicroflows(usedMicroflows);


//    const usedNanoflows = await findNanoflowsInSnippet(model, 'Snip_Login_Button');
//    console.log(`Insgesamt gefundene Nanoflows insgesamt: ${usedNanoflows.length}`);


//    const usedJavaActions = await findConnectedJavaActions(model, 'Nav_GuestHomePage');
}

async function findConnectedMicroflows(
    model: IModel,
    startMicroflowName: string
): Promise<microflows.IMicroflow[]> {
    const allMicroflows = model.allMicroflows();
    const processedMicroflows: Set<string> = new Set();
    const processedPages: Set<string> = new Set();
    const processedSnippets: Set<string> = new Set();
    const resultMicroflows: microflows.IMicroflow[] = [];

    console.log(`Starte Suche nach verbundenen Microflows für "${startMicroflowName}"`);

    const startMicroflow = allMicroflows.find((mf) => mf.name === startMicroflowName);
    if (!startMicroflow) {
        console.error(`Microflow "${startMicroflowName}" wurde nicht gefunden.`);
        return [];
    }

    await processMicroflow(startMicroflow);

    async function processMicroflow(mf: microflows.IMicroflow) {
        if (!mf || processedMicroflows.has(mf.id)) return;
        processedMicroflows.add(mf.id);

        console.log(`Verarbeite Microflow: ${mf.name}`);
        const loadedMf = await mf.load();
        resultMicroflows.push(loadedMf);

        if (!loadedMf.objectCollection) return;

        for (const obj of loadedMf.objectCollection.objects || []) {
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

        console.log(`Betrete Seite: ${page.name}`);
        const loadedPage = await page.load();

        const widgets: pages.Widget[] = [];
        loadedPage.traverse((structure) => {
            if (structure instanceof pages.Widget) {
                widgets.push(structure);
            }
        });

        console.log(`Widgets auf Seite "${loadedPage.name}": ${widgets.length}`);
        await processWidgets(widgets, `Seite: ${loadedPage.name}`);
    }

    async function processSnippet(snippet: pages.Snippet) {
        if (!snippet || processedSnippets.has(snippet.id)) return;
        processedSnippets.add(snippet.id);

        console.log(`Betrete Snippet: ${snippet.name}`);
        const widgets: pages.Widget[] = [];
        snippet.traverse((structure) => {
            if (structure instanceof pages.Widget) {
                widgets.push(structure);
            }
        });

        console.log(`Widgets im Snippet "${snippet.name}": ${widgets.length}`);
        await processWidgets(widgets, `Snippet: ${snippet.name}`);
    }

    async function processWidgets(widgets: pages.Widget[], context: string) {
        for (const widget of widgets) {
            console.log(`Widget: ${widget.structureTypeName}, Name: ${(widget as any).name || "N/A"}`);

            if (
                widget instanceof pages.ActionButton &&
                widget.action instanceof pages.MicroflowClientAction &&
                widget.action.microflowSettings.microflow
            ) {
                const widgetMicroflow = widget.action.microflowSettings.microflow;
                console.log(`Gefundener Microflow "${widgetMicroflow.name}" in ${context}.`);
                await processMicroflow(widgetMicroflow);
            }

            if (widget instanceof pages.SnippetCallWidget && widget.snippetCall?.snippet) {
                const snippet = await widget.snippetCall.snippet.load();
                console.log(`Gefundenes Snippet "${snippet.name}" in ${context}.`);
                await processSnippet(snippet);
            }
        }
    }

    return Array.from(new Set(resultMicroflows.map((mf) => mf.id))).map(
        (id) => resultMicroflows.find((mf) => mf.id === id)!
    );
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

async function findNanoflowsInSnippet(
    model: IModel,
    snippetName: string
): Promise<microflows.INanoflow[]> {
    const processedSnippets: Set<string> = new Set();
    const processedPages: Set<string> = new Set();
    const foundNanoflows: microflows.INanoflow[] = [];

    console.log(`Starte Suche nach Nanoflows im Snippet "${snippetName}"`);

    // Suche das Snippet
    const targetSnippet = model.allSnippets().find((snippet) => snippet.name === snippetName);
    if (!targetSnippet) {
        console.error(`Snippet "${snippetName}" wurde nicht gefunden.`);
        return [];
    }

    // Lade das Snippet
    const loadedSnippet = await targetSnippet.load();
    console.log(`Betrete Snippet: ${loadedSnippet.name}`);

    // Durchsuche die Widgets des Snippets
    await processSnippet(loadedSnippet);

    async function processSnippet(snippet: pages.Snippet) {
        if (!snippet || processedSnippets.has(snippet.id)) return;
        processedSnippets.add(snippet.id);

        const widgets: pages.Widget[] = [];
        snippet.traverse((structure) => {
            if (structure instanceof pages.Widget) {
                widgets.push(structure);
            }
        });

        console.log(`Widgets im Snippet "${snippet.name}": ${widgets.length}`);

        // Suche nach Nanoflows in den Widgets
        await processWidgets(widgets, `Snippet: ${snippet.name}`);
    }

    async function processPage(page: pages.IPage) {
        if (!page || processedPages.has(page.id)) return;
        processedPages.add(page.id);

        console.log(`Betrete Seite: ${page.name}`);
        const loadedPage = await page.load();

        const widgets: pages.Widget[] = [];
        loadedPage.traverse((structure) => {
            if (structure instanceof pages.Widget) {
                widgets.push(structure);
            }
        });

        console.log(`Widgets auf Seite "${loadedPage.name}": ${widgets.length}`);
        await processWidgets(widgets, `Seite: ${page.name}`);
    }

    async function processWidgets(widgets: pages.Widget[], context: string) {
        for (const widget of widgets) {
            console.log(`Widget: ${widget.structureTypeName}, Name: ${(widget as any).name || "N/A"}`);
    
            // Verarbeite Nanoflow in ActionButtons
            if (
                widget instanceof pages.ActionButton &&
                widget.action instanceof pages.CallNanoflowClientAction &&
                widget.action.nanoflow
            ) {
                const widgetNanoflow = widget.action.nanoflow;
                console.log(`Gefundener Nanoflow "${widgetNanoflow.name}" in ${context}.`);
                await processNanoflow(widgetNanoflow);
            }
    
            // Verarbeite Nanoflow in Timer-Events (Custom Widgets)
            if (widget instanceof customwidgets.CustomWidget && widget.structureTypeName === "CustomWidgets$CustomWidget") {
                const nanoflow = (widget as any).nanoflow;
                if (nanoflow) {
                    console.log(`Gefundener Nanoflow "${nanoflow.name}" im Custom Widget "${(widget as any).name || "N/A"}" in ${context}.`);
                    await processNanoflow(nanoflow);
                } else {
                    console.log(`Widget "${widget.structureTypeName}" in ${context} enthält keinen Nanoflow.`);
                }
            }
    
            // Verarbeite Buttons mit Page-Referenzen
            if (
                widget instanceof pages.ActionButton &&
                widget.action instanceof pages.PageClientAction &&
                widget.action.pageSettings?.page
            ) {
                const widgetPage = widget.action.pageSettings.page;
                console.log(`Gefundene Seite "${widgetPage.name}" in ${context} (aufgerufen durch Button).`);
                await processPage(widgetPage);
            }
    
            // Verarbeite Snippets
            if (widget instanceof pages.SnippetCallWidget && widget.snippetCall?.snippet) {
                const snippet = await widget.snippetCall.snippet.load();
                console.log(`Gefundenes Snippet "${snippet.name}" in ${context}.`);
                await processSnippet(snippet);
            }
        }
    }

    async function processNanoflow(nf: microflows.INanoflow) {
        if (!nf || foundNanoflows.some((existing) => existing.id === nf.id)) return;

        console.log(`Verarbeite Nanoflow: ${nf.name}`);
        foundNanoflows.push(await nf.load());
    }

    console.log(`Gesamtanzahl gefundener Nanoflows: ${foundNanoflows.length}`);
    return foundNanoflows;
}

async function findConnectedJavaActions(
    model: IModel,
    startMicroflowName: string
): Promise<javaactions.IJavaAction[]> {
    const allMicroflows = model.allMicroflows();
    const processedMicroflows: Set<string> = new Set();
    const resultJavaActions: javaactions.IJavaAction[] = [];

    console.log(`Starte Suche nach Java-Actions für Microflow "${startMicroflowName}"`);

    // Finde den Start-Microflow
    const startMicroflow = allMicroflows.find((mf) => mf.name === startMicroflowName);
    if (!startMicroflow) {
        console.error(`Microflow "${startMicroflowName}" wurde nicht gefunden.`);
        return [];
    }

    // Beginne mit der Verarbeitung des Start-Microflows
    await processMicroflow(startMicroflow);

    async function processMicroflow(mf: microflows.IMicroflow) {
        // Vermeide doppelte Verarbeitung
        if (!mf || processedMicroflows.has(mf.id)) return;
        processedMicroflows.add(mf.id);

        console.log(`Verarbeite Microflow: ${mf.name}`);
        const loadedMf = await mf.load();

        if (!loadedMf.objectCollection) return;

        // Durchlaufe alle Aktivitäten im Microflow
        for (const obj of loadedMf.objectCollection.objects || []) {
            console.log(`Prüfe Objekt: ${obj.structureTypeName}`);

            // Suche nach Java-Actions
            if (obj instanceof microflows.JavaActionCallAction) {
                const javaAction = obj.javaAction;
                if (javaAction) {
                    console.log(`Gefundene Java-Action "${javaAction.name}" in Microflow "${mf.name}".`);
                    if (!resultJavaActions.some((ja) => ja.id === javaAction.id)) {
                        resultJavaActions.push(javaAction);
                    }
                } else {
                    console.warn(`JavaActionCallAction gefunden, aber keine Java-Aktion verknüpft im Microflow "${mf.name}".`);
                }
            }

            // Rekursive Verarbeitung für aufgerufene Microflows
            if (obj instanceof microflows.ActionActivity && obj.action instanceof microflows.MicroflowCallAction) {
                const calledMicroflow = obj.action.microflowCall?.microflow;
                if (calledMicroflow) {
                    console.log(`Microflow "${mf.name}" ruft Microflow "${calledMicroflow.name}" auf.`);
                    await processMicroflow(calledMicroflow);
                }
            }

            // Prüfe auf Seitenaufrufe
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
        console.log(`Betrete Seite: ${page.name}`);
        const loadedPage = await page.load();

        const widgets: pages.Widget[] = [];
        loadedPage.traverse((structure) => {
            if (structure instanceof pages.Widget) {
                widgets.push(structure);
            }
        });

        console.log(`Widgets auf Seite "${loadedPage.name}": ${widgets.length}`);
        await processWidgets(widgets, `Seite: ${loadedPage.name}`);
    }

    async function processWidgets(widgets: pages.Widget[], context: string) {
        for (const widget of widgets) {
            console.log(`Widget: ${widget.structureTypeName}, Name: ${(widget as any).name || "N/A"}`);

            // Verarbeite Buttons mit Microflow-Referenzen
            if (
                widget instanceof pages.ActionButton &&
                widget.action instanceof pages.MicroflowClientAction &&
                widget.action.microflowSettings.microflow
            ) {
                const widgetMicroflow = widget.action.microflowSettings.microflow;
                console.log(`Gefundener Microflow "${widgetMicroflow.name}" in ${context}.`);
                await processMicroflow(widgetMicroflow);
            }

            // Verarbeite Buttons mit Page-Referenzen
            if (
                widget instanceof pages.ActionButton &&
                widget.action instanceof pages.PageClientAction &&
                widget.action.pageSettings?.page
            ) {
                const widgetPage = widget.action.pageSettings.page;
                console.log(`Gefundene Seite "${widgetPage.name}" in ${context} (aufgerufen durch Button).`);
                await processPage(widgetPage);
            }

            // Verarbeite Snippets
            if (widget instanceof pages.SnippetCallWidget && widget.snippetCall?.snippet) {
                const snippet = await widget.snippetCall.snippet.load();
                console.log(`Gefundenes Snippet "${snippet.name}" in ${context}.`);
                await processSnippet(snippet);
            }
        }
    }

    async function processSnippet(snippet: pages.Snippet) {
        console.log(`Betrete Snippet: ${snippet.name}`);
        const widgets: pages.Widget[] = [];
        snippet.traverse((structure) => {
            if (structure instanceof pages.Widget) {
                widgets.push(structure);
            }
        });

        console.log(`Widgets im Snippet "${snippet.name}": ${widgets.length}`);
        await processWidgets(widgets, `Snippet: ${snippet.name}`);
    }

    console.log(`Gesamtanzahl gefundener Java-Actions: ${resultJavaActions.length}`);
    return resultJavaActions;
}

main().catch(console.error);