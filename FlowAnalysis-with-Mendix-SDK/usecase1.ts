// https://docs.mendix.com/apidocs-mxsdk/mxsdk/?_gl=1*1f4kxe4*_gcl_au*MTEzNzQxNDQyMC4xNzM1NTU2NDMw#2-2-mendix-model-sdk
// https://medium.com/@himanshuagarwal1395/setting-up-environment-variables-in-macos-sierra-f5978369b255
// https://www.mendix.com/evaluation-guide/enterprise-capabilities/openness-extensibility/openness-api-sdk/

import { IModel, microflows, pages, IStructure } from "mendixmodelsdk";
import { MendixPlatformClient } from "mendixplatformsdk";
import * as fs from "fs";

function logToFile(message: string) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync("debug-log.txt", `[${timestamp}] ${message}\n`);
}

console.log = (message?: any, ...optionalParams: any[]) => {
    const formattedMessage = `${message} ${optionalParams.join(" ")}`;
    logToFile(formattedMessage);
};

async function main() {
    const client = new MendixPlatformClient();
    const app = await client.getApp("7c43ad0e-fa7d-4495-b9e5-61737578894f");
    const workingCopy = await app.createTemporaryWorkingCopy("main");
    const model = await workingCopy.openModel();

  await collectAllMicroflows(model);
//  await findUsedMicroflows(model);
//  await countAllWidgets(model);
//  await countUsedWidgets(model);
  countWidgetsIncludingSnippets(model, "LoginPage");
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


main().catch(console.error);