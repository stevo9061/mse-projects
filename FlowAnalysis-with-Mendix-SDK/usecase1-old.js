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
    fs.appendFileSync("usecase1-log.txt", "[".concat(timestamp, "] ").concat(message, "\n"));
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
        var client, app, workingCopy, model, modulename, usedMicroflows3, snippetName, targetSnippet, loadedSnippet, widgets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Starte Main-Funktion...");
                    client = new mendixplatformsdk_1.MendixPlatformClient();
                    return [4 /*yield*/, client.getApp("7c43ad0e-fa7d-4495-b9e5-61737578894f")];
                case 1:
                    app = _a.sent();
                    return [4 /*yield*/, app.createTemporaryWorkingCopy("main")];
                case 2:
                    workingCopy = _a.sent();
                    return [4 /*yield*/, workingCopy.openModel()];
                case 3:
                    model = _a.sent();
                    modulename = "user_registration_and_login";
                    return [4 /*yield*/, findConnectedMicroflows(model, 'Nav_GuestHomePage')];
                case 4:
                    usedMicroflows3 = _a.sent();
                    snippetName = "ForgotPassword.LoginSnippet";
                    targetSnippet = model.allSnippets().find(function (snippet) { return snippet.qualifiedName === snippetName; });
                    if (!targetSnippet) {
                        console.error("Snippet \"".concat(snippetName, "\" wurde nicht gefunden."));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, targetSnippet.load()];
                case 5:
                    loadedSnippet = _a.sent();
                    widgets = [];
                    loadedSnippet.traverse(function (structure) {
                        if (structure instanceof mendixmodelsdk_1.pages.Widget) {
                            widgets.push(structure);
                        }
                    });
                    console.log("Widgets im Snippet \"".concat(snippetName, "\":"), widgets.length);
                    // await processWidgets(widgets, `Snippet: ${snippetName}`);
                    //console.log(`Insgesamt verwendete Microflows im Modul "${modulename}":`, usedMicroflows.length);
                    //console.log(`Insgesamt verwendete Microflows im Modul "${modulename}":`, usedMicroflows2.length);
                    console.log("Insgesamt verwendete Microflows im Modul \"".concat(modulename, "\":"), usedMicroflows3.length);
                    return [2 /*return*/];
            }
        });
    });
}
function findConnectedMicroflows(model, startMicroflowName) {
    return __awaiter(this, void 0, void 0, function () {
        function processWidgets(widgets, context) {
            return __awaiter(this, void 0, void 0, function () {
                var _i, widgets_1, widget, widgetMicroflow, events, _a, events_1, event_1, eventMicroflow, eventPage, snippet;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _i = 0, widgets_1 = widgets;
                            _d.label = 1;
                        case 1:
                            if (!(_i < widgets_1.length)) return [3 /*break*/, 15];
                            widget = widgets_1[_i];
                            console.log("Widget: ".concat(widget.structureTypeName, ", Name: ").concat(widget.name || "N/A"));
                            if (!(widget instanceof mendixmodelsdk_1.pages.ActionButton &&
                                widget.action instanceof mendixmodelsdk_1.pages.MicroflowClientAction &&
                                widget.action.microflowSettings.microflow)) return [3 /*break*/, 3];
                            widgetMicroflow = widget.action.microflowSettings.microflow;
                            console.log("Gefundener Microflow \"".concat(widgetMicroflow.name, "\" in ").concat(context, "."));
                            return [4 /*yield*/, processMicroflow(widgetMicroflow)];
                        case 2:
                            _d.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            console.log("Widget \"".concat(widget.structureTypeName, "\" in ").concat(context, " enth\u00E4lt keine direkten Microflow-Verweise."));
                            _d.label = 4;
                        case 4:
                            if (!('events' in widget)) return [3 /*break*/, 10];
                            events = widget.events || [];
                            _a = 0, events_1 = events;
                            _d.label = 5;
                        case 5:
                            if (!(_a < events_1.length)) return [3 /*break*/, 10];
                            event_1 = events_1[_a];
                            if (!(event_1.action instanceof mendixmodelsdk_1.pages.MicroflowClientAction &&
                                event_1.action.microflowSettings.microflow)) return [3 /*break*/, 7];
                            eventMicroflow = event_1.action.microflowSettings.microflow;
                            console.log("Gefundener Microflow durch OnClick-Event \"".concat(eventMicroflow.name, "\" in ").concat(context, "."));
                            return [4 /*yield*/, processMicroflow(eventMicroflow)];
                        case 6:
                            _d.sent();
                            _d.label = 7;
                        case 7:
                            if (!(event_1.action instanceof mendixmodelsdk_1.pages.PageClientAction &&
                                ((_b = event_1.action.pageSettings) === null || _b === void 0 ? void 0 : _b.page))) return [3 /*break*/, 9];
                            eventPage = event_1.action.pageSettings.page;
                            console.log("Gefundene Seite durch OnClick-Event \"".concat(eventPage.name, "\" in ").concat(context, "."));
                            return [4 /*yield*/, processPage(eventPage)];
                        case 8:
                            _d.sent();
                            _d.label = 9;
                        case 9:
                            _a++;
                            return [3 /*break*/, 5];
                        case 10:
                            if (!(widget instanceof mendixmodelsdk_1.pages.SnippetCallWidget && ((_c = widget.snippetCall) === null || _c === void 0 ? void 0 : _c.snippet))) return [3 /*break*/, 13];
                            return [4 /*yield*/, widget.snippetCall.snippet.load()];
                        case 11:
                            snippet = _d.sent();
                            console.log("Gefundenes Snippet \"".concat(snippet.name, "\" in ").concat(context, "."));
                            return [4 /*yield*/, processSnippet(snippet)];
                        case 12:
                            _d.sent();
                            return [3 /*break*/, 14];
                        case 13:
                            console.log("Widget \"".concat(widget.structureTypeName, "\" in ").concat(context, " enth\u00E4lt kein referenziertes Snippet."));
                            _d.label = 14;
                        case 14:
                            _i++;
                            return [3 /*break*/, 1];
                        case 15: return [2 /*return*/];
                    }
                });
            });
        }
        function processMicroflow(mf) {
            return __awaiter(this, void 0, void 0, function () {
                var loadedMf, microflowObjects, _i, microflowObjects_1, obj, calledMicroflow, calledPage;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            // Überprüfen, ob der Microflow bereits verarbeitet wurde
                            if (!mf || processedMicroflows.has(mf.id))
                                return [2 /*return*/];
                            processedMicroflows.add(mf.id);
                            console.log("Verarbeite Microflow: ".concat(mf.name));
                            return [4 /*yield*/, mf.load()];
                        case 1:
                            loadedMf = _b.sent();
                            resultMicroflows.push(mf);
                            // Prüfen, ob der Microflow Aktivitäten (objectCollection) hat
                            if (!loadedMf.objectCollection)
                                return [2 /*return*/];
                            microflowObjects = loadedMf.objectCollection.objects || [];
                            _i = 0, microflowObjects_1 = microflowObjects;
                            _b.label = 2;
                        case 2:
                            if (!(_i < microflowObjects_1.length)) return [3 /*break*/, 7];
                            obj = microflowObjects_1[_i];
                            if (!(obj instanceof mendixmodelsdk_1.microflows.ActionActivity && obj.action instanceof mendixmodelsdk_1.microflows.MicroflowCallAction)) return [3 /*break*/, 4];
                            calledMicroflow = (_a = obj.action.microflowCall) === null || _a === void 0 ? void 0 : _a.microflow;
                            if (!calledMicroflow) return [3 /*break*/, 4];
                            console.log("Microflow \"".concat(mf.name, "\" ruft Microflow \"").concat(calledMicroflow.name, "\" auf."));
                            return [4 /*yield*/, processMicroflow(calledMicroflow)];
                        case 3:
                            _b.sent(); // Rekursive Verarbeitung
                            _b.label = 4;
                        case 4:
                            if (!(obj instanceof mendixmodelsdk_1.microflows.ActionActivity && obj.action instanceof mendixmodelsdk_1.microflows.ShowPageAction)) return [3 /*break*/, 6];
                            calledPage = obj.action.pageSettings.page;
                            if (!calledPage) return [3 /*break*/, 6];
                            console.log("Microflow \"".concat(mf.name, "\" ruft Seite \"").concat(calledPage.name, "\" auf."));
                            return [4 /*yield*/, processPage(calledPage)];
                        case 5:
                            _b.sent(); // Verarbeite die referenzierte Seite
                            _b.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 2];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
        function processPage(page) {
            return __awaiter(this, void 0, void 0, function () {
                var loadedPage, widgets;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // Prüfen, ob die Seite bereits verarbeitet wurde
                            if (!page || processedPages.has(page.id))
                                return [2 /*return*/];
                            processedPages.add(page.id);
                            console.log("Betrete processPage f\u00FCr Seite: ".concat(page.name));
                            return [4 /*yield*/, page.load()];
                        case 1:
                            loadedPage = _a.sent();
                            widgets = [];
                            // Alle Widgets auf der Seite sammeln
                            loadedPage.traverse(function (structure) {
                                if (structure instanceof mendixmodelsdk_1.pages.Widget) {
                                    widgets.push(structure);
                                }
                            });
                            console.log("Widgets auf Seite \"".concat(loadedPage.name, "\":"), widgets.map(function (w) { return w.structureTypeName; }).join(","));
                            // Verarbeite die gefundenen Widgets
                            return [4 /*yield*/, processWidgets(widgets, "Seite: ".concat(loadedPage.name))];
                        case 2:
                            // Verarbeite die gefundenen Widgets
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        function processSnippet(snippet) {
            return __awaiter(this, void 0, void 0, function () {
                var widgets;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!snippet || processedSnippets.has(snippet.id))
                                return [2 /*return*/];
                            processedSnippets.add(snippet.id);
                            widgets = [];
                            snippet.traverse(function (structure) {
                                if (structure instanceof mendixmodelsdk_1.pages.Widget) {
                                    widgets.push(structure);
                                }
                            });
                            console.log("Widgets im Snippet \"".concat(snippet.name, "\":"), widgets.map(function (w) { return w.structureTypeName; }).join(", "));
                            // Widgets im Snippet verarbeiten
                            return [4 /*yield*/, processWidgets2(widgets, "Snippet: ".concat(snippet.name))];
                        case 1:
                            // Widgets im Snippet verarbeiten
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        function processWidgets2(widgets, context) {
            return __awaiter(this, void 0, void 0, function () {
                var _i, widgets_2, widget, widgetMicroflow, events, _a, events_2, event_2, eventMicroflow, eventPage, snippet;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _i = 0, widgets_2 = widgets;
                            _d.label = 1;
                        case 1:
                            if (!(_i < widgets_2.length)) return [3 /*break*/, 13];
                            widget = widgets_2[_i];
                            console.log("Widget: ".concat(widget.structureTypeName, ", Name: ").concat(widget.name || "N/A"));
                            if (!(widget instanceof mendixmodelsdk_1.pages.ActionButton &&
                                widget.action instanceof mendixmodelsdk_1.pages.MicroflowClientAction &&
                                widget.action.microflowSettings.microflow)) return [3 /*break*/, 3];
                            widgetMicroflow = widget.action.microflowSettings.microflow;
                            console.log("Gefundener Microflow \"".concat(widgetMicroflow.name, "\" in ").concat(context, "."));
                            return [4 /*yield*/, processMicroflow(widgetMicroflow)];
                        case 2:
                            _d.sent();
                            _d.label = 3;
                        case 3:
                            if (!('events' in widget)) return [3 /*break*/, 9];
                            events = widget.events || [];
                            _a = 0, events_2 = events;
                            _d.label = 4;
                        case 4:
                            if (!(_a < events_2.length)) return [3 /*break*/, 9];
                            event_2 = events_2[_a];
                            if (!(event_2.action instanceof mendixmodelsdk_1.pages.MicroflowClientAction &&
                                event_2.action.microflowSettings.microflow)) return [3 /*break*/, 6];
                            eventMicroflow = event_2.action.microflowSettings.microflow;
                            console.log("Gefundener Microflow durch OnClick-Event \"".concat(eventMicroflow.name, "\" in ").concat(context, "."));
                            return [4 /*yield*/, processMicroflow(eventMicroflow)];
                        case 5:
                            _d.sent();
                            _d.label = 6;
                        case 6:
                            if (!(event_2.action instanceof mendixmodelsdk_1.pages.PageClientAction &&
                                ((_b = event_2.action.pageSettings) === null || _b === void 0 ? void 0 : _b.page))) return [3 /*break*/, 8];
                            eventPage = event_2.action.pageSettings.page;
                            console.log("Gefundene Seite durch OnClick-Event \"".concat(eventPage.name, "\" in ").concat(context, "."));
                            return [4 /*yield*/, processPage(eventPage)];
                        case 7:
                            _d.sent();
                            _d.label = 8;
                        case 8:
                            _a++;
                            return [3 /*break*/, 4];
                        case 9:
                            if (!(widget instanceof mendixmodelsdk_1.pages.SnippetCallWidget && ((_c = widget.snippetCall) === null || _c === void 0 ? void 0 : _c.snippet))) return [3 /*break*/, 12];
                            return [4 /*yield*/, widget.snippetCall.snippet.load()];
                        case 10:
                            snippet = _d.sent();
                            console.log("Gefundenes Snippet \"".concat(snippet.name, "\" in ").concat(context, "."));
                            return [4 /*yield*/, processSnippet(snippet)];
                        case 11:
                            _d.sent();
                            _d.label = 12;
                        case 12:
                            _i++;
                            return [3 /*break*/, 1];
                        case 13: return [2 /*return*/];
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
                var references, allPages, _i, allPages_4, page, layout, widgets, _a, widgets_3, widget, allMicroflows, _b, allMicroflows_2, mf, loadedMf, microflowObjects, _c, microflowObjects_2, obj;
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
                            for (_a = 0, widgets_3 = widgets; _a < widgets_3.length; _a++) {
                                widget = widgets_3[_a];
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
                                for (_c = 0, microflowObjects_2 = microflowObjects; _c < microflowObjects_2.length; _c++) {
                                    obj = microflowObjects_2[_c];
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
        function findConnectedMicroflows(model, startMicroflowName) {
            return __awaiter(this, void 0, void 0, function () {
                function processMicroflow(mf) {
                    return __awaiter(this, void 0, void 0, function () {
                        var loadedMf, microflowObjects, _i, microflowObjects_3, obj, calledMicroflow, calledPage;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!mf || processedMicroflows.has(mf.id))
                                        return [2 /*return*/];
                                    processedMicroflows.add(mf.id);
                                    console.log("Verarbeite Microflow: ".concat(mf.name));
                                    return [4 /*yield*/, mf.load()];
                                case 1:
                                    loadedMf = _b.sent();
                                    resultMicroflows.push(mf);
                                    if (!loadedMf.objectCollection)
                                        return [2 /*return*/];
                                    microflowObjects = loadedMf.objectCollection.objects || [];
                                    _i = 0, microflowObjects_3 = microflowObjects;
                                    _b.label = 2;
                                case 2:
                                    if (!(_i < microflowObjects_3.length)) return [3 /*break*/, 7];
                                    obj = microflowObjects_3[_i];
                                    if (!(obj instanceof mendixmodelsdk_1.microflows.ActionActivity && obj.action instanceof mendixmodelsdk_1.microflows.MicroflowCallAction)) return [3 /*break*/, 4];
                                    calledMicroflow = (_a = obj.action.microflowCall) === null || _a === void 0 ? void 0 : _a.microflow;
                                    if (!calledMicroflow) return [3 /*break*/, 4];
                                    console.log("Microflow \"".concat(mf.name, "\" ruft Microflow \"").concat(calledMicroflow.name, "\" auf."));
                                    return [4 /*yield*/, processMicroflow(calledMicroflow)];
                                case 3:
                                    _b.sent();
                                    _b.label = 4;
                                case 4:
                                    if (!(obj instanceof mendixmodelsdk_1.microflows.ActionActivity && obj.action instanceof mendixmodelsdk_1.microflows.ShowPageAction)) return [3 /*break*/, 6];
                                    calledPage = obj.action.pageSettings.page;
                                    if (!calledPage) return [3 /*break*/, 6];
                                    console.log("Microflow \"".concat(mf.name, "\" ruft Seite \"").concat(calledPage.name, "\" auf."));
                                    return [4 /*yield*/, processPage(calledPage)];
                                case 5:
                                    _b.sent();
                                    _b.label = 6;
                                case 6:
                                    _i++;
                                    return [3 /*break*/, 2];
                                case 7: return [2 /*return*/];
                            }
                        });
                    });
                }
                function processPage(page) {
                    return __awaiter(this, void 0, void 0, function () {
                        var loadedPage, layout, widgets;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    if (!page || processedPages.has(page.id))
                                        return [2 /*return*/];
                                    processedPages.add(page.id);
                                    console.log("Betrete processPage f\u00FCr Seite: ".concat(page.name));
                                    return [4 /*yield*/, page.load()];
                                case 1:
                                    loadedPage = _d.sent();
                                    return [4 /*yield*/, ((_b = (_a = loadedPage.layoutCall) === null || _a === void 0 ? void 0 : _a.layout) === null || _b === void 0 ? void 0 : _b.load())];
                                case 2:
                                    layout = _d.sent();
                                    widgets = [];
                                    (_c = layout === null || layout === void 0 ? void 0 : layout.content) === null || _c === void 0 ? void 0 : _c.traverse(function (structure) {
                                        if (structure instanceof mendixmodelsdk_1.pages.Widget) {
                                            widgets.push(structure);
                                        }
                                    });
                                    console.log("Widgets auf Seite \"".concat(loadedPage.name, "\":"), widgets.map(function (w) { return w.structureTypeName; }));
                                    return [4 /*yield*/, processWidgets(widgets, "Seite: ".concat(loadedPage.name))];
                                case 3:
                                    _d.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                }
                function processWidgets(widgets, context) {
                    return __awaiter(this, void 0, void 0, function () {
                        var _i, widgets_4, widget, widgetMicroflow, containedWidget, snippet, events, _a, events_3, event_3, eventMicroflow, eventPage, snippet;
                        var _b, _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    console.log("Verarbeite Widgets in ".concat(context));
                                    _i = 0, widgets_4 = widgets;
                                    _e.label = 1;
                                case 1:
                                    if (!(_i < widgets_4.length)) return [3 /*break*/, 19];
                                    widget = widgets_4[_i];
                                    console.log("Widget: ".concat(widget.structureTypeName, ", Name: ").concat(widget.name || "N/A"));
                                    if (!(widget instanceof mendixmodelsdk_1.pages.ActionButton &&
                                        widget.action instanceof mendixmodelsdk_1.pages.MicroflowClientAction &&
                                        widget.action.microflowSettings.microflow)) return [3 /*break*/, 3];
                                    widgetMicroflow = widget.action.microflowSettings.microflow;
                                    console.log("Gefundener Microflow \"".concat(widgetMicroflow.name, "\" in ").concat(context, "."));
                                    return [4 /*yield*/, processMicroflow(widgetMicroflow)];
                                case 2:
                                    _e.sent();
                                    _e.label = 3;
                                case 3:
                                    if (!(widget instanceof mendixmodelsdk_1.pages.Placeholder)) return [3 /*break*/, 9];
                                    console.log("Placeholder gefunden: ".concat(widget.name));
                                    containedWidget = widget.widget;
                                    if (!!containedWidget) return [3 /*break*/, 4];
                                    console.log("Placeholder \"".concat(widget.name, "\" enth\u00E4lt kein Widget."));
                                    return [3 /*break*/, 9];
                                case 4:
                                    console.log("Placeholder \"".concat(widget.name, "\" enth\u00E4lt Widget vom Typ: ").concat(containedWidget.structureTypeName));
                                    if (!(containedWidget instanceof mendixmodelsdk_1.pages.SnippetCallWidget && ((_b = containedWidget.snippetCall) === null || _b === void 0 ? void 0 : _b.snippet))) return [3 /*break*/, 7];
                                    return [4 /*yield*/, containedWidget.snippetCall.snippet.load()];
                                case 5:
                                    snippet = _e.sent();
                                    console.log("Gefundenes Snippet im Placeholder: ".concat(snippet.name));
                                    return [4 /*yield*/, processSnippet(snippet)];
                                case 6:
                                    _e.sent();
                                    return [3 /*break*/, 9];
                                case 7:
                                    // Falls es kein Snippet ist, Widgets im Placeholder weiterverarbeiten
                                    console.log("Kein Snippet, sondern ein anderes Widget im Placeholder: ".concat(containedWidget.structureTypeName));
                                    return [4 /*yield*/, processWidgets([containedWidget], "Placeholder: ".concat(widget.name))];
                                case 8:
                                    _e.sent();
                                    _e.label = 9;
                                case 9:
                                    if (!('events' in widget)) return [3 /*break*/, 15];
                                    events = widget.events || [];
                                    _a = 0, events_3 = events;
                                    _e.label = 10;
                                case 10:
                                    if (!(_a < events_3.length)) return [3 /*break*/, 15];
                                    event_3 = events_3[_a];
                                    if (!(event_3.action instanceof mendixmodelsdk_1.pages.MicroflowClientAction &&
                                        event_3.action.microflowSettings.microflow)) return [3 /*break*/, 12];
                                    eventMicroflow = event_3.action.microflowSettings.microflow;
                                    console.log("Gefundener Microflow durch OnClick-Event \"".concat(eventMicroflow.name, "\" in ").concat(context, "."));
                                    return [4 /*yield*/, processMicroflow(eventMicroflow)];
                                case 11:
                                    _e.sent();
                                    _e.label = 12;
                                case 12:
                                    if (!(event_3.action instanceof mendixmodelsdk_1.pages.PageClientAction &&
                                        ((_c = event_3.action.pageSettings) === null || _c === void 0 ? void 0 : _c.page))) return [3 /*break*/, 14];
                                    eventPage = event_3.action.pageSettings.page;
                                    console.log("Gefundene Seite durch OnClick-Event \"".concat(eventPage.name, "\" in ").concat(context, "."));
                                    return [4 /*yield*/, processPage(eventPage)];
                                case 13:
                                    _e.sent();
                                    _e.label = 14;
                                case 14:
                                    _a++;
                                    return [3 /*break*/, 10];
                                case 15:
                                    if (!(widget instanceof mendixmodelsdk_1.pages.SnippetCallWidget && ((_d = widget.snippetCall) === null || _d === void 0 ? void 0 : _d.snippet))) return [3 /*break*/, 18];
                                    return [4 /*yield*/, widget.snippetCall.snippet.load()];
                                case 16:
                                    snippet = _e.sent();
                                    console.log("Gefundenes Snippet \"".concat(snippet.name, "\" in ").concat(context, "."));
                                    return [4 /*yield*/, processSnippet(snippet)];
                                case 17:
                                    _e.sent();
                                    _e.label = 18;
                                case 18:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 19: return [2 /*return*/];
                            }
                        });
                    });
                }
                function processSnippet(snippet) {
                    return __awaiter(this, void 0, void 0, function () {
                        var widgets;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!snippet || processedSnippets.has(snippet.id))
                                        return [2 /*return*/];
                                    processedSnippets.add(snippet.id);
                                    console.log("Betrete processSnippet f\u00FCr Snippet: ".concat(snippet.name));
                                    widgets = [];
                                    snippet.traverse(function (structure) {
                                        if (structure instanceof mendixmodelsdk_1.pages.Widget) {
                                            widgets.push(structure);
                                        }
                                    });
                                    console.log("Widgets im Snippet \"".concat(snippet.name, "\":"), widgets.map(function (w) { return w.structureTypeName; }));
                                    return [4 /*yield*/, processWidgets(widgets, "Snippet: ".concat(snippet.name))];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                }
                var allMicroflows, processedMicroflows, processedPages, processedSnippets, resultMicroflows, startMicroflow;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            allMicroflows = model.allMicroflows();
                            console.log("Alle Microflows:", allMicroflows.map(function (mf) { return mf.name; }));
                            processedMicroflows = new Set();
                            processedPages = new Set();
                            processedSnippets = new Set();
                            resultMicroflows = [];
                            console.log("Starte Suche nach verbundenen Microflows f\u00FCr \"".concat(startMicroflowName, "\""));
                            startMicroflow = allMicroflows.find(function (mf) { return mf.name === startMicroflowName; });
                            if (!startMicroflow) {
                                console.error("Microflow \"".concat(startMicroflowName, "\" wurde nicht gefunden."));
                                return [2 /*return*/, []];
                            }
                            return [4 /*yield*/, processMicroflow(startMicroflow)];
                        case 1:
                            _a.sent();
                            console.log("Gefundene Microflows:", resultMicroflows.map(function (mf) { return mf.name; }));
                            return [2 /*return*/, resultMicroflows];
                    }
                });
            });
        }
        var allMicroflows, allPages, processedMicroflows, processedPages, processedSnippets, resultMicroflows, startMicroflow;
        return __generator(this, function (_a) {
            allMicroflows = model.allMicroflows();
            allPages = model.allPages();
            processedMicroflows = new Set();
            processedPages = new Set();
            processedSnippets = new Set();
            resultMicroflows = [];
            console.log("Starte Suche nach verbundenen Microflows f\u00FCr \"".concat(startMicroflowName, "\""));
            startMicroflow = allMicroflows.find(function (mf) { return mf.name === startMicroflowName; });
            if (!startMicroflow) {
                console.error("Microflow \"".concat(startMicroflowName, "\" wurde nicht gefunden."));
                return [2 /*return*/, []];
            }
            // Funktionen wie processMicroflow, processPage, processSnippet werden hier verwendet...
            return [2 /*return*/, resultMicroflows];
        });
    });
}
main().catch(console.error);
