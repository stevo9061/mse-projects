"use strict";
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
        var client, app, workingCopy, model, usedMicroflows, microflowsInUseCC;
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
                    return [4 /*yield*/, findConnectedMicroflows(model, 'Nav_GuestHomePage')];
                case 4:
                    usedMicroflows = _a.sent();
                    console.log("Insgesamt gefundene Microflows insgesamt: ".concat(usedMicroflows.length));
                    return [4 /*yield*/, calculateComplexityForMicroflows(usedMicroflows)];
                case 5:
                    microflowsInUseCC = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function findConnectedMicroflows(model, startMicroflowName) {
    return __awaiter(this, void 0, void 0, function () {
        function processMicroflow(mf) {
            return __awaiter(this, void 0, void 0, function () {
                var loadedMf, _i, _a, obj, calledMicroflow, calledPage;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!mf || processedMicroflows.has(mf.id))
                                return [2 /*return*/];
                            processedMicroflows.add(mf.id);
                            console.log("Verarbeite Microflow: ".concat(mf.name));
                            return [4 /*yield*/, mf.load()];
                        case 1:
                            loadedMf = _c.sent();
                            resultMicroflows.push(loadedMf);
                            if (!loadedMf.objectCollection)
                                return [2 /*return*/];
                            _i = 0, _a = loadedMf.objectCollection.objects || [];
                            _c.label = 2;
                        case 2:
                            if (!(_i < _a.length)) return [3 /*break*/, 7];
                            obj = _a[_i];
                            if (!(obj instanceof mendixmodelsdk_1.microflows.ActionActivity && obj.action instanceof mendixmodelsdk_1.microflows.MicroflowCallAction)) return [3 /*break*/, 4];
                            calledMicroflow = (_b = obj.action.microflowCall) === null || _b === void 0 ? void 0 : _b.microflow;
                            if (!calledMicroflow) return [3 /*break*/, 4];
                            console.log("Microflow \"".concat(mf.name, "\" ruft Microflow \"").concat(calledMicroflow.name, "\" auf."));
                            return [4 /*yield*/, processMicroflow(calledMicroflow)];
                        case 3:
                            _c.sent();
                            _c.label = 4;
                        case 4:
                            if (!(obj instanceof mendixmodelsdk_1.microflows.ActionActivity && obj.action instanceof mendixmodelsdk_1.microflows.ShowPageAction)) return [3 /*break*/, 6];
                            calledPage = obj.action.pageSettings.page;
                            if (!calledPage) return [3 /*break*/, 6];
                            console.log("Microflow \"".concat(mf.name, "\" ruft Seite \"").concat(calledPage.name, "\" auf."));
                            return [4 /*yield*/, processPage(calledPage)];
                        case 5:
                            _c.sent();
                            _c.label = 6;
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
                            if (!page || processedPages.has(page.id))
                                return [2 /*return*/];
                            processedPages.add(page.id);
                            console.log("Betrete Seite: ".concat(page.name));
                            return [4 /*yield*/, page.load()];
                        case 1:
                            loadedPage = _a.sent();
                            widgets = [];
                            loadedPage.traverse(function (structure) {
                                if (structure instanceof mendixmodelsdk_1.pages.Widget) {
                                    widgets.push(structure);
                                }
                            });
                            console.log("Widgets auf Seite \"".concat(loadedPage.name, "\": ").concat(widgets.length));
                            return [4 /*yield*/, processWidgets(widgets, "Seite: ".concat(loadedPage.name))];
                        case 2:
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
                            console.log("Betrete Snippet: ".concat(snippet.name));
                            widgets = [];
                            snippet.traverse(function (structure) {
                                if (structure instanceof mendixmodelsdk_1.pages.Widget) {
                                    widgets.push(structure);
                                }
                            });
                            console.log("Widgets im Snippet \"".concat(snippet.name, "\": ").concat(widgets.length));
                            return [4 /*yield*/, processWidgets(widgets, "Snippet: ".concat(snippet.name))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        function processWidgets(widgets, context) {
            return __awaiter(this, void 0, void 0, function () {
                var _i, widgets_1, widget, widgetMicroflow, snippet;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _i = 0, widgets_1 = widgets;
                            _b.label = 1;
                        case 1:
                            if (!(_i < widgets_1.length)) return [3 /*break*/, 7];
                            widget = widgets_1[_i];
                            console.log("Widget: ".concat(widget.structureTypeName, ", Name: ").concat(widget.name || "N/A"));
                            if (!(widget instanceof mendixmodelsdk_1.pages.ActionButton &&
                                widget.action instanceof mendixmodelsdk_1.pages.MicroflowClientAction &&
                                widget.action.microflowSettings.microflow)) return [3 /*break*/, 3];
                            widgetMicroflow = widget.action.microflowSettings.microflow;
                            console.log("Gefundener Microflow \"".concat(widgetMicroflow.name, "\" in ").concat(context, "."));
                            return [4 /*yield*/, processMicroflow(widgetMicroflow)];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            if (!(widget instanceof mendixmodelsdk_1.pages.SnippetCallWidget && ((_a = widget.snippetCall) === null || _a === void 0 ? void 0 : _a.snippet))) return [3 /*break*/, 6];
                            return [4 /*yield*/, widget.snippetCall.snippet.load()];
                        case 4:
                            snippet = _b.sent();
                            console.log("Gefundenes Snippet \"".concat(snippet.name, "\" in ").concat(context, "."));
                            return [4 /*yield*/, processSnippet(snippet)];
                        case 5:
                            _b.sent();
                            _b.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 1];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
        var allMicroflows, processedMicroflows, processedPages, processedSnippets, resultMicroflows, startMicroflow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allMicroflows = model.allMicroflows();
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
                    return [2 /*return*/, Array.from(new Set(resultMicroflows.map(function (mf) { return mf.id; }))).map(function (id) { return resultMicroflows.find(function (mf) { return mf.id === id; }); })];
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
function findNanoflowsInSnippet(model, snippetName) {
    return __awaiter(this, void 0, void 0, function () {
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
                            console.log("Widgets im Snippet \"".concat(snippet.name, "\": ").concat(widgets.length));
                            // Suche nach Nanoflows in den Widgets
                            return [4 /*yield*/, processWidgets(widgets, "Snippet: ".concat(snippet.name))];
                        case 1:
                            // Suche nach Nanoflows in den Widgets
                            _a.sent();
                            return [2 /*return*/];
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
                            if (!page || processedPages.has(page.id))
                                return [2 /*return*/];
                            processedPages.add(page.id);
                            console.log("Betrete Seite: ".concat(page.name));
                            return [4 /*yield*/, page.load()];
                        case 1:
                            loadedPage = _a.sent();
                            widgets = [];
                            loadedPage.traverse(function (structure) {
                                if (structure instanceof mendixmodelsdk_1.pages.Widget) {
                                    widgets.push(structure);
                                }
                            });
                            console.log("Widgets auf Seite \"".concat(loadedPage.name, "\": ").concat(widgets.length));
                            return [4 /*yield*/, processWidgets(widgets, "Seite: ".concat(page.name))];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        function processWidgets(widgets, context) {
            return __awaiter(this, void 0, void 0, function () {
                var _i, widgets_2, widget, widgetNanoflow, nanoflow, widgetPage, snippet;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _i = 0, widgets_2 = widgets;
                            _c.label = 1;
                        case 1:
                            if (!(_i < widgets_2.length)) return [3 /*break*/, 12];
                            widget = widgets_2[_i];
                            console.log("Widget: ".concat(widget.structureTypeName, ", Name: ").concat(widget.name || "N/A"));
                            if (!(widget instanceof mendixmodelsdk_1.pages.ActionButton &&
                                widget.action instanceof mendixmodelsdk_1.pages.CallNanoflowClientAction &&
                                widget.action.nanoflow)) return [3 /*break*/, 3];
                            widgetNanoflow = widget.action.nanoflow;
                            console.log("Gefundener Nanoflow \"".concat(widgetNanoflow.name, "\" in ").concat(context, "."));
                            return [4 /*yield*/, processNanoflow(widgetNanoflow)];
                        case 2:
                            _c.sent();
                            _c.label = 3;
                        case 3:
                            if (!(widget instanceof mendixmodelsdk_1.customwidgets.CustomWidget && widget.structureTypeName === "CustomWidgets$CustomWidget")) return [3 /*break*/, 6];
                            nanoflow = widget.nanoflow;
                            if (!nanoflow) return [3 /*break*/, 5];
                            console.log("Gefundener Nanoflow \"".concat(nanoflow.name, "\" im Custom Widget \"").concat(widget.name || "N/A", "\" in ").concat(context, "."));
                            return [4 /*yield*/, processNanoflow(nanoflow)];
                        case 4:
                            _c.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            console.log("Widget \"".concat(widget.structureTypeName, "\" in ").concat(context, " enth\u00E4lt keinen Nanoflow."));
                            _c.label = 6;
                        case 6:
                            if (!(widget instanceof mendixmodelsdk_1.pages.ActionButton &&
                                widget.action instanceof mendixmodelsdk_1.pages.PageClientAction &&
                                ((_a = widget.action.pageSettings) === null || _a === void 0 ? void 0 : _a.page))) return [3 /*break*/, 8];
                            widgetPage = widget.action.pageSettings.page;
                            console.log("Gefundene Seite \"".concat(widgetPage.name, "\" in ").concat(context, " (aufgerufen durch Button)."));
                            return [4 /*yield*/, processPage(widgetPage)];
                        case 7:
                            _c.sent();
                            _c.label = 8;
                        case 8:
                            if (!(widget instanceof mendixmodelsdk_1.pages.SnippetCallWidget && ((_b = widget.snippetCall) === null || _b === void 0 ? void 0 : _b.snippet))) return [3 /*break*/, 11];
                            return [4 /*yield*/, widget.snippetCall.snippet.load()];
                        case 9:
                            snippet = _c.sent();
                            console.log("Gefundenes Snippet \"".concat(snippet.name, "\" in ").concat(context, "."));
                            return [4 /*yield*/, processSnippet(snippet)];
                        case 10:
                            _c.sent();
                            _c.label = 11;
                        case 11:
                            _i++;
                            return [3 /*break*/, 1];
                        case 12: return [2 /*return*/];
                    }
                });
            });
        }
        function processNanoflow(nf) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!nf || foundNanoflows.some(function (existing) { return existing.id === nf.id; }))
                                return [2 /*return*/];
                            console.log("Verarbeite Nanoflow: ".concat(nf.name));
                            _b = (_a = foundNanoflows).push;
                            return [4 /*yield*/, nf.load()];
                        case 1:
                            _b.apply(_a, [_c.sent()]);
                            return [2 /*return*/];
                    }
                });
            });
        }
        var processedSnippets, processedPages, foundNanoflows, targetSnippet, loadedSnippet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    processedSnippets = new Set();
                    processedPages = new Set();
                    foundNanoflows = [];
                    console.log("Starte Suche nach Nanoflows im Snippet \"".concat(snippetName, "\""));
                    targetSnippet = model.allSnippets().find(function (snippet) { return snippet.name === snippetName; });
                    if (!targetSnippet) {
                        console.error("Snippet \"".concat(snippetName, "\" wurde nicht gefunden."));
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, targetSnippet.load()];
                case 1:
                    loadedSnippet = _a.sent();
                    console.log("Betrete Snippet: ".concat(loadedSnippet.name));
                    // Durchsuche die Widgets des Snippets
                    return [4 /*yield*/, processSnippet(loadedSnippet)];
                case 2:
                    // Durchsuche die Widgets des Snippets
                    _a.sent();
                    console.log("Gesamtanzahl gefundener Nanoflows: ".concat(foundNanoflows.length));
                    return [2 /*return*/, foundNanoflows];
            }
        });
    });
}
function findConnectedJavaActions(model, startMicroflowName) {
    return __awaiter(this, void 0, void 0, function () {
        function processMicroflow(mf) {
            return __awaiter(this, void 0, void 0, function () {
                var loadedMf, _loop_1, _i, _a, obj;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            // Vermeide doppelte Verarbeitung
                            if (!mf || processedMicroflows.has(mf.id))
                                return [2 /*return*/];
                            processedMicroflows.add(mf.id);
                            console.log("Verarbeite Microflow: ".concat(mf.name));
                            return [4 /*yield*/, mf.load()];
                        case 1:
                            loadedMf = _c.sent();
                            if (!loadedMf.objectCollection)
                                return [2 /*return*/];
                            _loop_1 = function (obj) {
                                var javaAction_1, calledMicroflow, calledPage;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            console.log("Pr\u00FCfe Objekt: ".concat(obj.structureTypeName));
                                            // Suche nach Java-Actions
                                            if (obj instanceof mendixmodelsdk_1.microflows.JavaActionCallAction) {
                                                javaAction_1 = obj.javaAction;
                                                if (javaAction_1) {
                                                    console.log("Gefundene Java-Action \"".concat(javaAction_1.name, "\" in Microflow \"").concat(mf.name, "\"."));
                                                    if (!resultJavaActions.some(function (ja) { return ja.id === javaAction_1.id; })) {
                                                        resultJavaActions.push(javaAction_1);
                                                    }
                                                }
                                                else {
                                                    console.warn("JavaActionCallAction gefunden, aber keine Java-Aktion verkn\u00FCpft im Microflow \"".concat(mf.name, "\"."));
                                                }
                                            }
                                            if (!(obj instanceof mendixmodelsdk_1.microflows.ActionActivity && obj.action instanceof mendixmodelsdk_1.microflows.MicroflowCallAction)) return [3 /*break*/, 2];
                                            calledMicroflow = (_b = obj.action.microflowCall) === null || _b === void 0 ? void 0 : _b.microflow;
                                            if (!calledMicroflow) return [3 /*break*/, 2];
                                            console.log("Microflow \"".concat(mf.name, "\" ruft Microflow \"").concat(calledMicroflow.name, "\" auf."));
                                            return [4 /*yield*/, processMicroflow(calledMicroflow)];
                                        case 1:
                                            _d.sent();
                                            _d.label = 2;
                                        case 2:
                                            if (!(obj instanceof mendixmodelsdk_1.microflows.ActionActivity && obj.action instanceof mendixmodelsdk_1.microflows.ShowPageAction)) return [3 /*break*/, 4];
                                            calledPage = obj.action.pageSettings.page;
                                            if (!calledPage) return [3 /*break*/, 4];
                                            console.log("Microflow \"".concat(mf.name, "\" ruft Seite \"").concat(calledPage.name, "\" auf."));
                                            return [4 /*yield*/, processPage(calledPage)];
                                        case 3:
                                            _d.sent();
                                            _d.label = 4;
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            };
                            _i = 0, _a = loadedMf.objectCollection.objects || [];
                            _c.label = 2;
                        case 2:
                            if (!(_i < _a.length)) return [3 /*break*/, 5];
                            obj = _a[_i];
                            return [5 /*yield**/, _loop_1(obj)];
                        case 3:
                            _c.sent();
                            _c.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [2 /*return*/];
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
                            console.log("Betrete Seite: ".concat(page.name));
                            return [4 /*yield*/, page.load()];
                        case 1:
                            loadedPage = _a.sent();
                            widgets = [];
                            loadedPage.traverse(function (structure) {
                                if (structure instanceof mendixmodelsdk_1.pages.Widget) {
                                    widgets.push(structure);
                                }
                            });
                            console.log("Widgets auf Seite \"".concat(loadedPage.name, "\": ").concat(widgets.length));
                            return [4 /*yield*/, processWidgets(widgets, "Seite: ".concat(loadedPage.name))];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        function processWidgets(widgets, context) {
            return __awaiter(this, void 0, void 0, function () {
                var _i, widgets_3, widget, widgetMicroflow, widgetPage, snippet;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _i = 0, widgets_3 = widgets;
                            _c.label = 1;
                        case 1:
                            if (!(_i < widgets_3.length)) return [3 /*break*/, 9];
                            widget = widgets_3[_i];
                            console.log("Widget: ".concat(widget.structureTypeName, ", Name: ").concat(widget.name || "N/A"));
                            if (!(widget instanceof mendixmodelsdk_1.pages.ActionButton &&
                                widget.action instanceof mendixmodelsdk_1.pages.MicroflowClientAction &&
                                widget.action.microflowSettings.microflow)) return [3 /*break*/, 3];
                            widgetMicroflow = widget.action.microflowSettings.microflow;
                            console.log("Gefundener Microflow \"".concat(widgetMicroflow.name, "\" in ").concat(context, "."));
                            return [4 /*yield*/, processMicroflow(widgetMicroflow)];
                        case 2:
                            _c.sent();
                            _c.label = 3;
                        case 3:
                            if (!(widget instanceof mendixmodelsdk_1.pages.ActionButton &&
                                widget.action instanceof mendixmodelsdk_1.pages.PageClientAction &&
                                ((_a = widget.action.pageSettings) === null || _a === void 0 ? void 0 : _a.page))) return [3 /*break*/, 5];
                            widgetPage = widget.action.pageSettings.page;
                            console.log("Gefundene Seite \"".concat(widgetPage.name, "\" in ").concat(context, " (aufgerufen durch Button)."));
                            return [4 /*yield*/, processPage(widgetPage)];
                        case 4:
                            _c.sent();
                            _c.label = 5;
                        case 5:
                            if (!(widget instanceof mendixmodelsdk_1.pages.SnippetCallWidget && ((_b = widget.snippetCall) === null || _b === void 0 ? void 0 : _b.snippet))) return [3 /*break*/, 8];
                            return [4 /*yield*/, widget.snippetCall.snippet.load()];
                        case 6:
                            snippet = _c.sent();
                            console.log("Gefundenes Snippet \"".concat(snippet.name, "\" in ").concat(context, "."));
                            return [4 /*yield*/, processSnippet(snippet)];
                        case 7:
                            _c.sent();
                            _c.label = 8;
                        case 8:
                            _i++;
                            return [3 /*break*/, 1];
                        case 9: return [2 /*return*/];
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
                            console.log("Betrete Snippet: ".concat(snippet.name));
                            widgets = [];
                            snippet.traverse(function (structure) {
                                if (structure instanceof mendixmodelsdk_1.pages.Widget) {
                                    widgets.push(structure);
                                }
                            });
                            console.log("Widgets im Snippet \"".concat(snippet.name, "\": ").concat(widgets.length));
                            return [4 /*yield*/, processWidgets(widgets, "Snippet: ".concat(snippet.name))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        var allMicroflows, processedMicroflows, resultJavaActions, startMicroflow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allMicroflows = model.allMicroflows();
                    processedMicroflows = new Set();
                    resultJavaActions = [];
                    console.log("Starte Suche nach Java-Actions f\u00FCr Microflow \"".concat(startMicroflowName, "\""));
                    startMicroflow = allMicroflows.find(function (mf) { return mf.name === startMicroflowName; });
                    if (!startMicroflow) {
                        console.error("Microflow \"".concat(startMicroflowName, "\" wurde nicht gefunden."));
                        return [2 /*return*/, []];
                    }
                    // Beginne mit der Verarbeitung des Start-Microflows
                    return [4 /*yield*/, processMicroflow(startMicroflow)];
                case 1:
                    // Beginne mit der Verarbeitung des Start-Microflows
                    _a.sent();
                    console.log("Gesamtanzahl gefundener Java-Actions: ".concat(resultJavaActions.length));
                    return [2 /*return*/, resultJavaActions];
            }
        });
    });
}
main().catch(console.error);
