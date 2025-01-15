import { IModel, microflows, pages } from "mendixmodelsdk";
import { MendixPlatformClient } from "mendixplatformsdk";


// https://docs.mendix.com/apidocs-mxsdk/mxsdk/?_gl=1*1f4kxe4*_gcl_au*MTEzNzQxNDQyMC4xNzM1NTU2NDMw#2-2-mendix-model-sdk
// https://medium.com/@himanshuagarwal1395/setting-up-environment-variables-in-macos-sierra-f5978369b255
// https://www.mendix.com/evaluation-guide/enterprise-capabilities/openness-extensibility/openness-api-sdk/
async function main() {
    

    const client = new MendixPlatformClient();

    const app = await client.createNewApp(`NewApp-${Date.now()}`, {
        repositoryType: "git",
    });

    const workingCopy = await app.createTemporaryWorkingCopy("main");
    const model = await workingCopy.openModel();

        // 1.Alle Microflows sammeln
        const allMicroflows = model.allMicroflows();
        console.log(`Anzahl der Microflows in der App: ${allMicroflows.length}`);
        allMicroflows.forEach(mf => {
            console.log(`Microflow-Name: ${mf.name}`);
        });

            // 2. Genutzte Microflows finden
            const usedMicroflows = [];
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
    
    async function findReferences(model: IModel, microflow: microflows.Microflow): Promise<any[]> {
        // Implement custom logic to find references for the microflow
        // This is a placeholder implementation
        return [];
    }

    // 3. Widgets zählen
const allPages = model.allPages();
let totalWidgets = 0;

for (const page of allPages) {
    if (page.isLoaded) {
        // Zugriff auf das Layout der Seite
        const layout = await page.layoutCall?.layout?.load();
        if (layout) {
            // Widgets aus dem Layout extrahieren
            const widgets = layout.widgets || [];
            const pageWidgets = widgets.length;

            totalWidgets += pageWidgets;

            console.log(`Seite: ${page.name} hat ${pageWidgets} Widgets`);
        } else {
            console.log(`Seite: ${page.name} hat keine Widgets`);
        }
    }
}
    // Optional: Änderungen vornehmen (auskommentiert)
    // const domainModelInterface = model.allDomainModels().filter(dm => dm.containerAsModule.name === "MyFirstModule")[0];
    // const domainModel = await domainModelInterface.load();
    // const entity = domainmodels.Entity.createIn(domainModel);
    // entity.name = `NewEntity_${Date.now()}`;
    // await model.flushChanges();

    await workingCopy.commitToRepository("main");
}

main().catch(console.error);
