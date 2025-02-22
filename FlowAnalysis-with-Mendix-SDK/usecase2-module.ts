import { IModel, microflows, pages, IStructure } from "mendixmodelsdk";
import { MendixPlatformClient } from "mendixplatformsdk";
import * as fs from "fs";

function logToFile(message: string) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync("usecase2-logger.txt", `[${timestamp}] ${message}\n`);
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
    console.log(`Working Copy ID: ${workingCopy.workingCopyId}`);
    const model = await workingCopy.openModel();

    const modulename = "CryptoDashboardApp"; // Name des Moduls
    const usedMicroflows = await findModuleMicroflows(model, modulename);
    console.log(`Insgesamt verwendete Microflows im Modul "${modulename}":`, usedMicroflows.length);

    const microflowsCC = calculateComplexityForMicroflows(usedMicroflows);



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

    // 3. Funktion zum Verarbeiten von Seiten
    async function processPage(page: pages.IPage) {
        if (!page || processedPages.has(page.id)) return; // Überspringe bereits verarbeitete Seiten
        processedPages.add(page.id);

        const loadedPage = await page.load();
        const layout = await loadedPage.layoutCall?.layout?.load();
        const widgets = layout?.widgets || [];
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

main().catch(console.error);