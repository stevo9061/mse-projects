// https://docs.mendix.com/apidocs-mxsdk/mxsdk/?_gl=1*1f4kxe4*_gcl_au*MTEzNzQxNDQyMC4xNzM1NTU2NDMw#2-2-mendix-model-sdk
// https://medium.com/@himanshuagarwal1395/setting-up-environment-variables-in-macos-sierra-f5978369b255
// https://www.mendix.com/evaluation-guide/enterprise-capabilities/openness-extensibility/openness-api-sdk/

import { IModel, microflows, pages } from "mendixmodelsdk";
import { MendixPlatformClient } from "mendixplatformsdk";

async function main() {
    const client = new MendixPlatformClient();
    const app = await client.getApp("33653cf8-d242-4d6d-8548-c09dde9c0ead");
    const workingCopy = await app.createTemporaryWorkingCopy("main");
    const model = await workingCopy.openModel();

    await collectAllMicroflows(model);
    await findUsedMicroflows(model);
    await countWidgets(model);
}

async function collectAllMicroflows(model: IModel) {
    const allMicroflows = model.allMicroflows();
    console.log(`Anzahl der Microflows in der App: ${allMicroflows.length}`);
    allMicroflows.forEach(mf => {
        console.log(`Microflow-Name: ${mf.name}`);
    });
}

async function findUsedMicroflows(model: IModel) {
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
}

async function countWidgets(model: IModel) {
    const allPages = model.allPages();
    let totalWidgets = 0;

    for (const page of allPages) {
        if (page.isLoaded) {
            const layout = await page.layoutCall?.layout?.load();
            if (layout) {
                const widgets = layout.widgets || [];
                const pageWidgets = widgets.length;
                totalWidgets += pageWidgets;
                console.log(`Seite: ${page.name} hat ${pageWidgets} Widgets`);
            } else {
                console.log(`Seite: ${page.name} hat keine Widgets`);
            }
        }
    }
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

main().catch(console.error);