"use strict";
// https://docs.mendix.com/apidocs-mxsdk/mxsdk/?_gl=1*1f4kxe4*_gcl_au*MTEzNzQxNDQyMC4xNzM1NTU2NDMw#2-2-mendix-model-sdk
// https://medium.com/@himanshuagarwal1395/setting-up-environment-variables-in-macos-sierra-f5978369b255
// https://www.mendix.com/evaluation-guide/enterprise-capabilities/openness-extensibility/openness-api-sdk/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mendixmodelsdk_1 = require("mendixmodelsdk");
var mendixplatformsdk_1 = require("mendixplatformsdk");
var fs = require("fs");
function logToFile(message) {
    var timestamp = new Date().toISOString();
    fs.appendFileSync("usecase2-log.txt", "[".concat(timestamp, "] ").concat(message, "\n"));
}
console.log = function (message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    var formattedMessage = "".concat(message, " ").concat(optionalParams.join(" "));
    logToFile(formattedMessage);
};
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var client, app, workingCopy, model, usedMicroflows, microflowsCC, usedNanoflows, nanoflowCC;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = new mendixplatformsdk_1.MendixPlatformClient();
                    return [4 /*yield*/, client.getApp("463b8de2-64ad-4c57-a149-4f758388b0f8")];
                case 1:
                    app = _a.sent();
                    return [4 /*yield*/, app.createTemporaryWorkingCopy("main")];
                case 2:
                    workingCopy = _a.sent();
                    return [4 /*yield*/, workingCopy.openModel()];
                case 3:
                    model = _a.sent();
                    return [4 /*yield*/, findUsedMicroflows(model)];
                case 4:
                    usedMicroflows = _a.sent();
                    microflowsCC = calculateComplexityForMicroflows(usedMicroflows);
                    return [4 /*yield*/, findUsedNanoflows(model)];
                case 5:
                    usedNanoflows = _a.sent();
                    return [4 /*yield*/, calculateComplexityForNanoflows(usedNanoflows)];
                case 6:
                    nanoflowCC = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function collectAllMicroflows(model) {
    return __awaiter(this, void 0, void 0, function () {
        var allMicroflows;
        return __generator(this, function (_a) {
            allMicroflows = model.allMicroflows();
            console.log("Anzahl der Microflows in der App: ".concat(allMicroflows.length));
            /*     allMicroflows.forEach(mf => {
                    console.log(`Microflow-Name: ${mf.name}`);
                }) */ ;
            return [2 /*return*/];
        });
    });
}
function findUsedMicroflows(model) {
    return __awaiter(this, void 0, void 0, function () {
        var allMicroflows, usedMicroflows, _i, allMicroflows_1, mf, loadedMicroflow, references;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allMicroflows = model.allMicroflows();
                    usedMicroflows = [];
                    _i = 0, allMicroflows_1 = allMicroflows;
                    _a.label = 1;
                case 1:
                    if (!(_i < allMicroflows_1.length)) return [3 /*break*/, 5];
                    mf = allMicroflows_1[_i];
                    return [4 /*yield*/, mf.load()];
                case 2:
                    loadedMicroflow = _a.sent();
                    return [4 /*yield*/, findReferences(model, loadedMicroflow)];
                case 3:
                    references = _a.sent();
                    if (references.length > 0) {
                        usedMicroflows.push(mf);
                    }
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5:
                    console.log("Anzahl der verwendeten Microflows: ".concat(usedMicroflows.length));
                    usedMicroflows.forEach(function (mf) {
                        console.log("Verwendeter Microflow: ".concat(mf.name));
                    });
                    return [2 /*return*/, usedMicroflows.length > 0 ? usedMicroflows : []];
            }
        });
    });
}
// Verwendete Nanoflows finden
function findUsedNanoflows(model) {
    return __awaiter(this, void 0, void 0, function () {
        var allNanoflows, usedNanoflows, _i, allNanoflows_1, nf, loadedNanoflow, references;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allNanoflows = model.allNanoflows();
                    usedNanoflows = [];
                    _i = 0, allNanoflows_1 = allNanoflows;
                    _a.label = 1;
                case 1:
                    if (!(_i < allNanoflows_1.length)) return [3 /*break*/, 5];
                    nf = allNanoflows_1[_i];
                    return [4 /*yield*/, nf.load()];
                case 2:
                    loadedNanoflow = _a.sent();
                    return [4 /*yield*/, findReferencesForNanoflow(model, loadedNanoflow)];
                case 3:
                    references = _a.sent();
                    if (references.length > 0) {
                        usedNanoflows.push(nf);
                    }
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5:
                    console.log("Anzahl der verwendeten Nanoflows: ".concat(usedNanoflows.length));
                    return [2 /*return*/, usedNanoflows];
            }
        });
    });
}
function calculateComplexityForMicroflows(usedMicroflows) {
    return __awaiter(this, void 0, void 0, function () {
        var totalComplexity, _i, usedMicroflows_1, mf, loadedMicroflow, complexity;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Beginne mit der Berechnung der Cyclomatic Complexity...");
                    totalComplexity = 0;
                    _i = 0, usedMicroflows_1 = usedMicroflows;
                    _a.label = 1;
                case 1:
                    if (!(_i < usedMicroflows_1.length)) return [3 /*break*/, 4];
                    mf = usedMicroflows_1[_i];
                    return [4 /*yield*/, mf.load()];
                case 2:
                    loadedMicroflow = _a.sent();
                    complexity = calculateCyclomaticComplexityMicroflows(loadedMicroflow);
                    totalComplexity += complexity;
                    console.log("Microflow \"".concat(loadedMicroflow.name, "\" hat eine Cyclomatic Complexity von ").concat(complexity));
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log("Gesamte Cyclomatic Complexity aller Microflows: ".concat(totalComplexity));
                    return [2 /*return*/];
            }
        });
    });
}
function calculateCyclomaticComplexityMicroflows(microflow) {
    var _a, _b, _c;
    var nodes = ((_a = microflow.objectCollection) === null || _a === void 0 ? void 0 : _a.objects.length) || 0;
    var edges = ((_b = microflow.flows) === null || _b === void 0 ? void 0 : _b.length) || 0;
    var conditions = 0; // Anzahl der Bedingungen (ExclusiveSplit)
    var loops = 0; // Anzahl der Schleifen (LoopedActivity)
    (_c = microflow.objectCollection) === null || _c === void 0 ? void 0 : _c.objects.forEach(function (obj) {
        if (obj instanceof mendixmodelsdk_1.microflows.ExclusiveSplit) {
            // Bedingungen (If/Else)
            conditions++;
        }
        if (obj instanceof mendixmodelsdk_1.microflows.LoopedActivity) {
            // Schleifen
            loops++;
        }
    });
    // Cyclomatic Complexity = (E - N) 1 + 2 + Bedingungen + Schleifen
    var complexity = 1 + conditions + loops;
    // Sicherstellen, dass die CC mindestens 1 ist
    return Math.max(1, complexity);
}
// Cyclomatic Complexity für Nanoflows berechnen
function calculateComplexityForNanoflows(usedNanoflows) {
    return __awaiter(this, void 0, void 0, function () {
        var totalComplexity, _i, usedNanoflows_1, nf, loadedNanoflow, complexity;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    totalComplexity = 0;
                    _i = 0, usedNanoflows_1 = usedNanoflows;
                    _a.label = 1;
                case 1:
                    if (!(_i < usedNanoflows_1.length)) return [3 /*break*/, 4];
                    nf = usedNanoflows_1[_i];
                    return [4 /*yield*/, nf.load()];
                case 2:
                    loadedNanoflow = _a.sent();
                    complexity = calculateCyclomaticComplexityNanoflows(loadedNanoflow);
                    totalComplexity += complexity;
                    console.log("Nanoflow \"".concat(loadedNanoflow.name, "\" hat eine Cyclomatic Complexity von ").concat(complexity));
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log("Gesamte Cyclomatic Complexity aller Nanoflows: ".concat(totalComplexity));
                    return [2 /*return*/, totalComplexity];
            }
        });
    });
}
// Cyclomatic Complexity für einen Flow berechnen
function calculateCyclomaticComplexityNanoflows(flow) {
    var _a;
    var conditions = 0;
    var loops = 0;
    (_a = flow.objectCollection) === null || _a === void 0 ? void 0 : _a.objects.forEach(function (obj) {
        if (obj instanceof mendixmodelsdk_1.microflows.ExclusiveSplit) {
            conditions++;
        }
        if (obj instanceof mendixmodelsdk_1.microflows.LoopedActivity) {
            loops++;
        }
    });
    // CC = 1 + Anzahl der Bedingungen + Anzahl der Schleifen
    return 1 + conditions + loops;
}
function countAllWidgets(model) {
    return __awaiter(this, void 0, void 0, function () {
        var allPages, allUsedPages, totalWidgets, _loop_1, _i, allPages_1, page;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allPages = model.allPages();
                    allUsedPages = [];
                    totalWidgets = 0;
                    _loop_1 = function (page) {
                        var loadedPage, widgetCount;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, page.load()];
                                case 1:
                                    loadedPage = _b.sent();
                                    widgetCount = 0;
                                    loadedPage.traverse(function (structure) {
                                        if (structure instanceof mendixmodelsdk_1.pages.Widget) {
                                            widgetCount++;
                                        }
                                    });
                                    //    console.log(`Seite "${loadedPage.name}" enthält ${widgetCount} Widgets.`);
                                    totalWidgets += widgetCount;
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, allPages_1 = allPages;
                    _a.label = 1;
                case 1:
                    if (!(_i < allPages_1.length)) return [3 /*break*/, 4];
                    page = allPages_1[_i];
                    return [5 /*yield**/, _loop_1(page)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log("Gesamtanzahl aller Widgets in allen Seiten die gefunden werden konnten: ".concat(totalWidgets));
                    return [2 /*return*/];
            }
        });
    });
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
function countWidgetsIncludingSnippets(model, pageName) {
    return __awaiter(this, void 0, void 0, function () {
        var allPages, totalWidgetCount, _i, allPages_2, page, loadedPage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allPages = model.allPages();
                    totalWidgetCount = 0;
                    _i = 0, allPages_2 = allPages;
                    _a.label = 1;
                case 1:
                    if (!(_i < allPages_2.length)) return [3 /*break*/, 5];
                    page = allPages_2[_i];
                    return [4 /*yield*/, page.load()];
                case 2:
                    loadedPage = _a.sent();
                    if (!(loadedPage.name === pageName)) return [3 /*break*/, 4];
                    console.log("Untersuche Seite: ".concat(loadedPage.name));
                    return [4 /*yield*/, traverseAndCountWidgetsIncludingSnippets(loadedPage, model)];
                case 3:
                    // Starte die vollständige Zählung der Widgets
                    totalWidgetCount = _a.sent();
                    // Ausgabe der Gesamtanzahl nach Abschluss der Zählung
                    console.log("Seite \"".concat(pageName, "\" enth\u00E4lt insgesamt ").concat(totalWidgetCount, " Widgets (inklusive Snippets)."));
                    return [2 /*return*/]; // Beenden, wenn die Seite gefunden wurde
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5:
                    console.log("Seite \"".concat(pageName, "\" nicht gefunden."));
                    return [2 /*return*/];
            }
        });
    });
}
function traverseAndCountWidgetsIncludingSnippets(structure, model) {
    return __awaiter(this, void 0, void 0, function () {
        var widgetCount, promises;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    widgetCount = 0;
                    promises = [];
                    // Traverse die Struktur asynchron
                    return [4 /*yield*/, structure.traverse(function (subStructure) {
                            var _a;
                            // Direkt Widget zählen
                            if (subStructure instanceof mendixmodelsdk_1.pages.Widget) {
                                console.log("Widget erkannt: ".concat(subStructure.structureTypeName));
                                widgetCount++;
                            }
                            // Falls ein SnippetCallWidget gefunden wird, lade und zähle die Widgets darin
                            if (subStructure instanceof mendixmodelsdk_1.pages.SnippetCallWidget) {
                                console.log("SnippetCallWidget gefunden, lade zugeh\u00F6riges Snippet.");
                                var snippetRef = (_a = subStructure.snippetCall) === null || _a === void 0 ? void 0 : _a.snippet;
                                if (snippetRef) {
                                    var snippetPromise = snippetRef.load().then(function (snippet) { return __awaiter(_this, void 0, void 0, function () {
                                        var snippetWidgetCount;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!snippet) return [3 /*break*/, 2];
                                                    console.log("Snippet \"".concat(snippet.name, "\" wird traversiert."));
                                                    return [4 /*yield*/, traverseAndCountWidgetsIncludingSnippets(snippet, model)];
                                                case 1:
                                                    snippetWidgetCount = _a.sent();
                                                    widgetCount += snippetWidgetCount; // Addiere Widgets aus dem Snippet
                                                    _a.label = 2;
                                                case 2: return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    promises.push(snippetPromise); // Füge die Operation der Liste hinzu
                                }
                            }
                        })];
                case 1:
                    // Traverse die Struktur asynchron
                    _a.sent();
                    // Warte auf alle asynchronen Traversierungen (z. B. das Laden von Snippets)
                    return [4 /*yield*/, Promise.all(promises)];
                case 2:
                    // Warte auf alle asynchronen Traversierungen (z. B. das Laden von Snippets)
                    _a.sent();
                    return [2 /*return*/, widgetCount]; // Gib die Gesamtanzahl zurück
            }
        });
    });
}
function checkMenuItems(menuItems, pageId) {
    var _a, _b;
    console.log("Pr\u00FCfe Men\u00FCeintr\u00E4ge: ".concat(menuItems.length));
    for (var _i = 0, menuItems_1 = menuItems; _i < menuItems_1.length; _i++) {
        var item = menuItems_1[_i];
        console.log("\u00DCberpr\u00FCfe Men\u00FCelement: ".concat(JSON.stringify(item, null, 2)));
        if (((_b = (_a = item.action) === null || _a === void 0 ? void 0 : _a.pageSettings) === null || _b === void 0 ? void 0 : _b.page) === pageId) {
            console.log("Seite \"".concat(pageId, "\" in Men\u00FC gefunden."));
            return true;
        }
        if (item.items && checkMenuItems(item.items, pageId)) {
            console.log("Seite \"".concat(pageId, "\" in Untermen\u00FC gefunden."));
            return true;
        }
    }
    return false; // Keine Referenz gefunden
}
function isPageUsedInNavigation(model, page) {
    return __awaiter(this, void 0, void 0, function () {
        var navigationDocs, _i, navigationDocs_1, navDoc, loadedNavDoc, _a, _b, profile, homePageProfile, roleBasedProfile, _c, _d, roleBasedHomePage, menuProfile, isReferenced;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    navigationDocs = model.allNavigationDocuments();
                    console.log("Anzahl der Navigationsdokumente: ".concat(navigationDocs.length));
                    _i = 0, navigationDocs_1 = navigationDocs;
                    _f.label = 1;
                case 1:
                    if (!(_i < navigationDocs_1.length)) return [3 /*break*/, 4];
                    navDoc = navigationDocs_1[_i];
                    return [4 /*yield*/, navDoc.load()];
                case 2:
                    loadedNavDoc = _f.sent();
                    console.log("Navigationsdokument geladen: ".concat(JSON.stringify(loadedNavDoc, null, 2)));
                    for (_a = 0, _b = loadedNavDoc.profiles; _a < _b.length; _a++) {
                        profile = _b[_a];
                        console.log("Navigationsprofil: ".concat(JSON.stringify(profile, null, 2))); // Debugging-Profil
                        console.log("\u00DCberpr\u00FCfe Profil: ".concat(profile.name));
                        // Prüfen, ob die Seite die Startseite ist
                        if ("homePage" in profile) {
                            homePageProfile = profile;
                            console.log("Homepage f\u00FCr Profil: ".concat(JSON.stringify(homePageProfile.homePage, null, 2))); // Debugging-Homepage
                            if (((_e = homePageProfile.homePage) === null || _e === void 0 ? void 0 : _e.page) === page.name) {
                                console.log("Seite \"".concat(page.name, "\" ist die Startseite."));
                                return [2 /*return*/, true];
                            }
                        }
                        // Prüfen, ob die Seite in rollenbasierten Homepages ist
                        if ("roleBasedHomePages" in profile) {
                            roleBasedProfile = profile;
                            for (_c = 0, _d = roleBasedProfile.roleBasedHomePages || []; _c < _d.length; _c++) {
                                roleBasedHomePage = _d[_c];
                                console.log("\u00DCberpr\u00FCfe rollenbasierte Homepage: ".concat(JSON.stringify(roleBasedHomePage, null, 2))); // Debugging rollenbasierte Homepage
                                if (roleBasedHomePage.page === page.name) {
                                    console.log("Seite \"".concat(page.name, "\" ist eine rollenbasierte Startseite."));
                                    return [2 /*return*/, true];
                                }
                            }
                        }
                        // Prüfen, ob die Seite in der Menüstruktur referenziert ist
                        if ("menuItemCollection" in profile) {
                            menuProfile = profile;
                            console.log("Men\u00FCeintr\u00E4ge: ".concat(JSON.stringify(menuProfile.menuItemCollection.items, null, 2))); // Debugging-Menü
                            isReferenced = checkMenuItems(menuProfile.menuItemCollection.items || [], page.name);
                            if (isReferenced) {
                                console.log("Seite \"".concat(page.name, "\" wird in der Men\u00FCstruktur verwendet."));
                                return [2 /*return*/, true];
                            }
                        }
                    }
                    _f.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, false]; // Seite wird nicht verwendet
            }
        });
    });
}
function isPageReferencedInNavigation(items, pageId) {
    var _a, _b;
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        // Prüfen, ob das Element eine Aktion enthält, die auf die Seite verweist
        if (((_b = (_a = item.action) === null || _a === void 0 ? void 0 : _a.page) === null || _b === void 0 ? void 0 : _b.id) === pageId) {
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
function findPageReferences(model, page) {
    return __awaiter(this, void 0, void 0, function () {
        var references, allLayouts, _i, allLayouts_1, layout, loadedLayout, allPages, _a, allPages_3, otherPage, loadedOtherPage;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    references = [];
                    allLayouts = model.allLayouts();
                    console.log("Anzahl der Layouts: ".concat(allLayouts.length));
                    _i = 0, allLayouts_1 = allLayouts;
                    _b.label = 1;
                case 1:
                    if (!(_i < allLayouts_1.length)) return [3 /*break*/, 4];
                    layout = allLayouts_1[_i];
                    return [4 /*yield*/, layout.load()];
                case 2:
                    loadedLayout = _b.sent();
                    console.log("Lade Layout: ".concat(loadedLayout.name));
                    loadedLayout.traverse(function (structure) {
                        var _a;
                        if (structure instanceof mendixmodelsdk_1.microflows.ShowPageAction &&
                            ((_a = structure.pageSettings.page) === null || _a === void 0 ? void 0 : _a.id) === page.id) {
                            console.log("Seite \"".concat(page.name, "\" in Layout referenziert."));
                            references.push(structure);
                        }
                    });
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    allPages = model.allPages();
                    _a = 0, allPages_3 = allPages;
                    _b.label = 5;
                case 5:
                    if (!(_a < allPages_3.length)) return [3 /*break*/, 8];
                    otherPage = allPages_3[_a];
                    return [4 /*yield*/, otherPage.load()];
                case 6:
                    loadedOtherPage = _b.sent();
                    console.log("Lade andere Seite: ".concat(loadedOtherPage.name));
                    loadedOtherPage.traverse(function (structure) {
                        var _a;
                        if (structure instanceof mendixmodelsdk_1.microflows.ShowPageAction &&
                            ((_a = structure.pageSettings.page) === null || _a === void 0 ? void 0 : _a.id) === page.id) {
                            console.log("Seite \"".concat(page.name, "\" durch andere Seite referenziert."));
                            references.push(structure);
                        }
                    });
                    _b.label = 7;
                case 7:
                    _a++;
                    return [3 /*break*/, 5];
                case 8: return [2 /*return*/, references];
            }
        });
    });
}
function findReferences(model, microflow) {
    return __awaiter(this, void 0, void 0, function () {
        var references, allPages, _i, allPages_4, page, layout, widgets, _a, widgets_1, widget, allMicroflows, _b, allMicroflows_2, mf, loadedMf, microflowObjects, _c, microflowObjects_1, obj;
        var _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    references = [];
                    allPages = model.allPages();
                    _i = 0, allPages_4 = allPages;
                    _j.label = 1;
                case 1:
                    if (!(_i < allPages_4.length)) return [3 /*break*/, 4];
                    page = allPages_4[_i];
                    if (!page.isLoaded) return [3 /*break*/, 3];
                    return [4 /*yield*/, ((_e = (_d = page.layoutCall) === null || _d === void 0 ? void 0 : _d.layout) === null || _e === void 0 ? void 0 : _e.load())];
                case 2:
                    layout = _j.sent();
                    widgets = (layout === null || layout === void 0 ? void 0 : layout.widgets) || [];
                    for (_a = 0, widgets_1 = widgets; _a < widgets_1.length; _a++) {
                        widget = widgets_1[_a];
                        if (widget instanceof mendixmodelsdk_1.pages.ActionButton && widget.action instanceof mendixmodelsdk_1.pages.MicroflowClientAction && ((_f = widget.action.microflowSettings.microflow) === null || _f === void 0 ? void 0 : _f.id) === microflow.id) {
                            references.push(widget);
                        }
                    }
                    _j.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    allMicroflows = model.allMicroflows();
                    _b = 0, allMicroflows_2 = allMicroflows;
                    _j.label = 5;
                case 5:
                    if (!(_b < allMicroflows_2.length)) return [3 /*break*/, 8];
                    mf = allMicroflows_2[_b];
                    return [4 /*yield*/, mf.load()];
                case 6:
                    loadedMf = _j.sent();
                    if (loadedMf.objectCollection) {
                        microflowObjects = loadedMf.objectCollection.objects || [];
                        for (_c = 0, microflowObjects_1 = microflowObjects; _c < microflowObjects_1.length; _c++) {
                            obj = microflowObjects_1[_c];
                            if (obj instanceof mendixmodelsdk_1.microflows.ActionActivity && obj.action instanceof mendixmodelsdk_1.microflows.MicroflowCallAction && ((_h = (_g = obj.action.microflowCall) === null || _g === void 0 ? void 0 : _g.microflow) === null || _h === void 0 ? void 0 : _h.id) === microflow.id) {
                                references.push(obj);
                            }
                        }
                    }
                    _j.label = 7;
                case 7:
                    _b++;
                    return [3 /*break*/, 5];
                case 8: return [2 /*return*/, references];
            }
        });
    });
}
// Referenzen eines Nanoflows finden
function findReferencesForNanoflow(model, nanoflow) {
    return __awaiter(this, void 0, void 0, function () {
        var references, allPages, _i, allPages_5, page, loadedPage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    references = [];
                    allPages = model.allPages();
                    _i = 0, allPages_5 = allPages;
                    _a.label = 1;
                case 1:
                    if (!(_i < allPages_5.length)) return [3 /*break*/, 4];
                    page = allPages_5[_i];
                    return [4 /*yield*/, page.load()];
                case 2:
                    loadedPage = _a.sent();
                    loadedPage.traverse(function (structure) {
                        var _a;
                        if (structure instanceof mendixmodelsdk_1.pages.ActionButton &&
                            structure.action instanceof mendixmodelsdk_1.pages.CallNanoflowClientAction &&
                            ((_a = structure.action.nanoflow) === null || _a === void 0 ? void 0 : _a.id) === nanoflow.id) {
                            references.push(structure);
                        }
                    });
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, references];
            }
        });
    });
}
function findEssentialFlows(model) {
    return __awaiter(this, void 0, void 0, function () {
        var essentialMicroflows, essentialNanoflows, allNavigationDocs, _i, allNavigationDocs_1, navDoc, loadedNavDoc, _a, _b, profile, homePage, references, roleBasedHomePages, _c, roleBasedHomePages_1, rbHomePage, loadedMicroflow, loadedPage, references, menuItems, _d, menuItems_2, item, references, uniqueMicroflows, uniqueNanoflows;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    essentialMicroflows = [];
                    essentialNanoflows = [];
                    allNavigationDocs = model.allNavigationDocuments();
                    console.log("Anzahl der Navigationsdokumente: ".concat(allNavigationDocs.length));
                    _i = 0, allNavigationDocs_1 = allNavigationDocs;
                    _g.label = 1;
                case 1:
                    if (!(_i < allNavigationDocs_1.length)) return [3 /*break*/, 18];
                    navDoc = allNavigationDocs_1[_i];
                    return [4 /*yield*/, navDoc.load()];
                case 2:
                    loadedNavDoc = _g.sent();
                    console.log("Navigation geladen: ".concat(JSON.stringify(loadedNavDoc, null, 2)));
                    _a = 0, _b = loadedNavDoc.profiles;
                    _g.label = 3;
                case 3:
                    if (!(_a < _b.length)) return [3 /*break*/, 17];
                    profile = _b[_a];
                    // Durchlaufe die Navigationseinträge
                    console.log("Navigationsprofil: ".concat(JSON.stringify(profile, null, 2)));
                    if (!("homePage" in profile)) return [3 /*break*/, 5];
                    homePage = (_e = profile.homePage) === null || _e === void 0 ? void 0 : _e.page;
                    if (!homePage) return [3 /*break*/, 5];
                    return [4 /*yield*/, findMicroflowAndNanoflowReferencesInPage(model, homePage)];
                case 4:
                    references = _g.sent();
                    essentialMicroflows.push.apply(essentialMicroflows, references.microflows);
                    essentialNanoflows.push.apply(essentialNanoflows, references.nanoflows);
                    _g.label = 5;
                case 5:
                    if (!("roleBasedHomePages" in profile)) return [3 /*break*/, 12];
                    roleBasedHomePages = profile.roleBasedHomePages || [];
                    console.log("Processing roleBasedHomePages: ".concat(JSON.stringify(roleBasedHomePages, null, 2)));
                    _c = 0, roleBasedHomePages_1 = roleBasedHomePages;
                    _g.label = 6;
                case 6:
                    if (!(_c < roleBasedHomePages_1.length)) return [3 /*break*/, 12];
                    rbHomePage = roleBasedHomePages_1[_c];
                    if (!rbHomePage.microflow) return [3 /*break*/, 8];
                    // Logge, was du hast:
                    console.log("Checking Microflow: ".concat(rbHomePage.microflow.qualifiedName || rbHomePage.microflow));
                    return [4 /*yield*/, rbHomePage.microflow.load()];
                case 7:
                    loadedMicroflow = _g.sent();
                    if (loadedMicroflow) {
                        console.log("Found and loaded Microflow: ".concat(loadedMicroflow.name));
                        essentialMicroflows.push(loadedMicroflow);
                    }
                    else {
                        console.log("Warnung: Microflow konnte nicht vollst\u00E4ndig geladen werden.");
                    }
                    _g.label = 8;
                case 8:
                    if (!rbHomePage.page) return [3 /*break*/, 11];
                    console.log("Checking Page: ".concat(rbHomePage.page.qualifiedName || rbHomePage.page));
                    return [4 /*yield*/, rbHomePage.page.load()];
                case 9:
                    loadedPage = _g.sent();
                    if (!loadedPage) {
                        console.warn("Warnung: Rolle: ".concat(rbHomePage.userRole, ", Page konnte nicht geladen werden."));
                        return [3 /*break*/, 11];
                    }
                    return [4 /*yield*/, collectReferencesFromLoadedPage(loadedPage)];
                case 10:
                    references = _g.sent();
                    essentialMicroflows.push.apply(essentialMicroflows, references.microflows);
                    essentialNanoflows.push.apply(essentialNanoflows, references.nanoflows);
                    _g.label = 11;
                case 11:
                    _c++;
                    return [3 /*break*/, 6];
                case 12:
                    if (!("menuItemCollection" in profile)) return [3 /*break*/, 16];
                    menuItems = ((_f = profile.menuItemCollection) === null || _f === void 0 ? void 0 : _f.items) || [];
                    _d = 0, menuItems_2 = menuItems;
                    _g.label = 13;
                case 13:
                    if (!(_d < menuItems_2.length)) return [3 /*break*/, 16];
                    item = menuItems_2[_d];
                    return [4 /*yield*/, findMicroflowAndNanoflowReferencesInMenuItem(model, item)];
                case 14:
                    references = _g.sent();
                    essentialMicroflows.push.apply(essentialMicroflows, references.microflows);
                    essentialNanoflows.push.apply(essentialNanoflows, references.nanoflows);
                    _g.label = 15;
                case 15:
                    _d++;
                    return [3 /*break*/, 13];
                case 16:
                    _a++;
                    return [3 /*break*/, 3];
                case 17:
                    _i++;
                    return [3 /*break*/, 1];
                case 18:
                    uniqueMicroflows = Array.from(new Set(essentialMicroflows));
                    uniqueNanoflows = Array.from(new Set(essentialNanoflows));
                    // **Hier Debugging für alle Microflows und Nanoflows einfügen**
                    console.log("Alle verfügbaren Microflows:");
                    model.allMicroflows().forEach(function (mf) { return console.log("- ".concat(mf.qualifiedName)); });
                    console.log("Alle verfügbaren Nanoflows:");
                    model.allNanoflows().forEach(function (nf) { return console.log("- ".concat(nf.qualifiedName)); });
                    // Logge die gefundenen Microflows und Nanoflows
                    console.log("Gefundene Microflows (".concat(uniqueMicroflows.length, "):"));
                    uniqueMicroflows.forEach(function (mf) { return console.log("- ".concat(mf.name)); });
                    console.log("Gefundene Nanoflows (".concat(uniqueNanoflows.length, "):"));
                    uniqueNanoflows.forEach(function (nf) { return console.log("- ".concat(nf.name)); });
                    return [2 /*return*/, {
                            microflows: uniqueMicroflows,
                            nanoflows: uniqueNanoflows,
                        }];
            }
        });
    });
}
function findMicroflowAndNanoflowReferencesInPage(model, pageRef) {
    return __awaiter(this, void 0, void 0, function () {
        var microflowsUsed, nanoflowsUsed, loadPromises, loadedPage;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    microflowsUsed = [];
                    nanoflowsUsed = [];
                    loadPromises = [];
                    return [4 /*yield*/, pageRef.load()];
                case 1:
                    loadedPage = _a.sent();
                    if (!loadedPage) {
                        console.warn("Seite konnte nicht geladen werden.");
                        return [2 /*return*/, { microflows: [], nanoflows: [] }];
                    }
                    console.log("Untersuche geladene Seite: ".concat(loadedPage.name));
                    // Wie gehabt: traverse + Microflow/Nanoflow laden
                    loadedPage.traverse(function (structure) {
                        if (structure instanceof mendixmodelsdk_1.pages.ActionButton &&
                            structure.action instanceof mendixmodelsdk_1.pages.MicroflowClientAction &&
                            structure.action.microflowSettings.microflow) {
                            var mfRef_1 = structure.action.microflowSettings.microflow;
                            loadPromises.push((function () { return __awaiter(_this, void 0, void 0, function () {
                                var loadedMf;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, mfRef_1.load()];
                                        case 1:
                                            loadedMf = _a.sent();
                                            console.log("Geladener Microflow: ".concat(loadedMf.name));
                                            microflowsUsed.push(loadedMf);
                                            return [2 /*return*/];
                                    }
                                });
                            }); })());
                        }
                        if (structure instanceof mendixmodelsdk_1.pages.ActionButton &&
                            structure.action instanceof mendixmodelsdk_1.pages.CallNanoflowClientAction &&
                            structure.action.nanoflow) {
                            var nfRef_1 = structure.action.nanoflow;
                            loadPromises.push((function () { return __awaiter(_this, void 0, void 0, function () {
                                var loadedNf;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, nfRef_1.load()];
                                        case 1:
                                            loadedNf = _a.sent();
                                            console.log("Geladener Nanoflow: ".concat(loadedNf.name));
                                            nanoflowsUsed.push(loadedNf);
                                            return [2 /*return*/];
                                    }
                                });
                            }); })());
                        }
                    });
                    // Auf alle Loads warten
                    return [4 /*yield*/, Promise.all(loadPromises)];
                case 2:
                    // Auf alle Loads warten
                    _a.sent();
                    return [2 /*return*/, { microflows: microflowsUsed, nanoflows: nanoflowsUsed }];
            }
        });
    });
}
function findMicroflowAndNanoflowReferencesInMenuItem(model, menuItem) {
    return __awaiter(this, void 0, void 0, function () {
        var microflowsUsed, nanoflowsUsed, microflowRef, loadedMicroflow, pageReferences, _i, _a, subItem, subReferences;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    microflowsUsed = [];
                    nanoflowsUsed = [];
                    console.log("Untersuche Men\u00FCeintrag: ".concat(JSON.stringify(menuItem, null, 2)));
                    if (!menuItem.action) return [3 /*break*/, 5];
                    if (!menuItem.action.microflow) return [3 /*break*/, 3];
                    console.log("Pr\u00FCfe Microflow: ".concat(menuItem.action.microflow));
                    microflowRef = model.allMicroflows().find(function (mf) { return mf.qualifiedName === menuItem.action.microflow; });
                    if (!microflowRef) return [3 /*break*/, 2];
                    console.log("Microflow gefunden: ".concat(microflowRef.name));
                    return [4 /*yield*/, safeLoad(microflowRef)];
                case 1:
                    loadedMicroflow = _c.sent();
                    if (loadedMicroflow) {
                        console.log("Microflow erfolgreich geladen: ".concat(loadedMicroflow.name));
                        // Jetzt ist exportLevel verfügbar
                        console.log("Export-Level: ".concat(safeAccessMicroflowExportLevel(loadedMicroflow)));
                        microflowsUsed.push(loadedMicroflow);
                    }
                    else {
                        console.log("Fehler: Microflow \"".concat(microflowRef.qualifiedName, "\" konnte nicht vollst\u00E4ndig geladen werden."));
                    }
                    return [3 /*break*/, 3];
                case 2:
                    console.log("Warnung: Microflow \"".concat(menuItem.action.microflow, "\" konnte nicht aufgel\u00F6st werden."));
                    _c.label = 3;
                case 3:
                    if (!((_b = menuItem.action.pageSettings) === null || _b === void 0 ? void 0 : _b.page)) return [3 /*break*/, 5];
                    return [4 /*yield*/, findMicroflowAndNanoflowReferencesInPage(model, menuItem.action.pageSettings.page)];
                case 4:
                    pageReferences = _c.sent();
                    microflowsUsed.push.apply(microflowsUsed, pageReferences.microflows);
                    nanoflowsUsed.push.apply(nanoflowsUsed, pageReferences.nanoflows);
                    _c.label = 5;
                case 5:
                    _i = 0, _a = menuItem.items || [];
                    _c.label = 6;
                case 6:
                    if (!(_i < _a.length)) return [3 /*break*/, 9];
                    subItem = _a[_i];
                    return [4 /*yield*/, findMicroflowAndNanoflowReferencesInMenuItem(model, subItem)];
                case 7:
                    subReferences = _c.sent();
                    microflowsUsed.push.apply(microflowsUsed, subReferences.microflows);
                    nanoflowsUsed.push.apply(nanoflowsUsed, subReferences.nanoflows);
                    _c.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9: return [2 /*return*/, { microflows: microflowsUsed, nanoflows: nanoflowsUsed }];
            }
        });
    });
}
function safeLoad(loadable) {
    return __awaiter(this, void 0, void 0, function () {
        var loadedObject, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, loadable.load()];
                case 1:
                    loadedObject = _a.sent();
                    return [2 /*return*/, loadedObject];
                case 2:
                    error_1 = _a.sent();
                    console.error("Fehler beim Laden eines Objekts:", error_1);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function safeAccessMicroflowExportLevel(microflow) {
    if (!microflow) {
        console.error("Microflow-Objekt ist null oder undefined.");
        return null;
    }
    try {
        console.log("Zugriff auf 'exportLevel' f\u00FCr Microflow: ".concat(microflow.name));
        var level = microflow.exportLevel.toString();
        return level;
    }
    catch (error) {
        console.error("Fehler beim Zugriff auf 'exportLevel':", error);
        return null;
    }
}
function collectReferencesFromLoadedPage(loadedPage) {
    return __awaiter(this, void 0, void 0, function () {
        var microflowsUsed, nanoflowsUsed, loadPromises;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    microflowsUsed = [];
                    nanoflowsUsed = [];
                    loadPromises = [];
                    // Alle Strukturen auf der Page durchlaufen
                    loadedPage.traverse(function (structure) {
                        // Beispiel: ActionButton mit Microflow-Aktion
                        if (structure instanceof mendixmodelsdk_1.pages.ActionButton &&
                            structure.action instanceof mendixmodelsdk_1.pages.MicroflowClientAction &&
                            structure.action.microflowSettings.microflow) {
                            var mfRef_2 = structure.action.microflowSettings.microflow;
                            loadPromises.push((function () { return __awaiter(_this, void 0, void 0, function () {
                                var loadedMf;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, mfRef_2.load()];
                                        case 1:
                                            loadedMf = _a.sent();
                                            microflowsUsed.push(loadedMf);
                                            return [2 /*return*/];
                                    }
                                });
                            }); })());
                        }
                        // Beispiel: ActionButton mit Nanoflow-Aktion
                        if (structure instanceof mendixmodelsdk_1.pages.ActionButton &&
                            structure.action instanceof mendixmodelsdk_1.pages.CallNanoflowClientAction &&
                            structure.action.nanoflow) {
                            var nfRef_2 = structure.action.nanoflow;
                            loadPromises.push((function () { return __awaiter(_this, void 0, void 0, function () {
                                var loadedNf;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, nfRef_2.load()];
                                        case 1:
                                            loadedNf = _a.sent();
                                            nanoflowsUsed.push(loadedNf);
                                            return [2 /*return*/];
                                    }
                                });
                            }); })());
                        }
                        // Ggf. weitere Strukturen, bei denen Microflows/Nanoflows verwendet werden.
                        // (OnChange, OnEnter, OnLeave, Events etc.)
                    });
                    // Auf alle Ladeoperationen warten
                    return [4 /*yield*/, Promise.all(loadPromises)];
                case 1:
                    // Auf alle Ladeoperationen warten
                    _a.sent();
                    return [2 /*return*/, { microflows: microflowsUsed, nanoflows: nanoflowsUsed }];
            }
        });
    });
}
main().catch(console.error);
