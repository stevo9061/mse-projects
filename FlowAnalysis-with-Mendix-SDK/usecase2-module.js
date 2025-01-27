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
    fs.appendFileSync("usecase2-logger.txt", "[".concat(timestamp, "] ").concat(message, "\n"));
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
        var client, app, workingCopy, model, modulename, usedMicroflows, microflowsCC;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Starte Main-Funktion...");
                    client = new mendixplatformsdk_1.MendixPlatformClient();
                    return [4 /*yield*/, client.getApp("33653cf8-d242-4d6d-8548-c09dde9c0ead")];
                case 1:
                    app = _a.sent();
                    return [4 /*yield*/, app.createTemporaryWorkingCopy("main")];
                case 2:
                    workingCopy = _a.sent();
                    console.log("Working Copy ID: ".concat(workingCopy.workingCopyId));
                    return [4 /*yield*/, workingCopy.openModel()];
                case 3:
                    model = _a.sent();
                    modulename = "CryptoDashboardApp";
                    return [4 /*yield*/, findModuleMicroflows(model, modulename)];
                case 4:
                    usedMicroflows = _a.sent();
                    console.log("Insgesamt verwendete Microflows im Modul \"".concat(modulename, "\":"), usedMicroflows.length);
                    microflowsCC = calculateComplexityForMicroflows(usedMicroflows);
                    return [2 /*return*/];
            }
        });
    });
}
function findModuleMicroflows(model, modulename) {
    return __awaiter(this, void 0, void 0, function () {
        // 2. Rekursive Funktion zum Verarbeiten von Microflows
        function processMicroflow(mf) {
            return __awaiter(this, void 0, void 0, function () {
                var loadedMf, microflowObjects, _i, microflowObjects_1, obj, calledMicroflow, calledPage;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!mf || processedMicroflows.has(mf.id))
                                return [2 /*return*/]; // Überspringe bereits verarbeitete Microflows
                            processedMicroflows.add(mf.id);
                            return [4 /*yield*/, mf.load()];
                        case 1:
                            loadedMf = _b.sent();
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
                            resultMicroflows.push(calledMicroflow);
                            return [4 /*yield*/, processMicroflow(calledMicroflow)];
                        case 3:
                            _b.sent(); // Rekursiver Aufruf
                            _b.label = 4;
                        case 4:
                            if (!(obj instanceof mendixmodelsdk_1.microflows.ActionActivity && obj.action instanceof mendixmodelsdk_1.microflows.ShowPageAction)) return [3 /*break*/, 6];
                            calledPage = obj.action.pageSettings.page;
                            if (!calledPage) return [3 /*break*/, 6];
                            console.log("Microflow \"".concat(mf.name, "\" ruft Seite \"").concat(calledPage.name, "\" auf."));
                            return [4 /*yield*/, processPage(calledPage)];
                        case 5:
                            _b.sent(); // Prozessiere die aufgerufene Seite
                            _b.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 2];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
        // 3. Funktion zum Verarbeiten von Seiten
        function processPage(page) {
            return __awaiter(this, void 0, void 0, function () {
                var loadedPage, layout, widgets, _i, widgets_1, widget, pageMicroflow;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!page || processedPages.has(page.id))
                                return [2 /*return*/]; // Überspringe bereits verarbeitete Seiten
                            processedPages.add(page.id);
                            return [4 /*yield*/, page.load()];
                        case 1:
                            loadedPage = _c.sent();
                            return [4 /*yield*/, ((_b = (_a = loadedPage.layoutCall) === null || _a === void 0 ? void 0 : _a.layout) === null || _b === void 0 ? void 0 : _b.load())];
                        case 2:
                            layout = _c.sent();
                            widgets = (layout === null || layout === void 0 ? void 0 : layout.widgets) || [];
                            _i = 0, widgets_1 = widgets;
                            _c.label = 3;
                        case 3:
                            if (!(_i < widgets_1.length)) return [3 /*break*/, 6];
                            widget = widgets_1[_i];
                            if (!(widget instanceof mendixmodelsdk_1.pages.ActionButton &&
                                widget.action instanceof mendixmodelsdk_1.pages.MicroflowClientAction &&
                                widget.action.microflowSettings.microflow)) return [3 /*break*/, 5];
                            pageMicroflow = widget.action.microflowSettings.microflow;
                            console.log("Gefundener Microflow \"".concat(pageMicroflow.name, "\" auf Seite \"").concat(loadedPage.name, "\"."));
                            resultMicroflows.push(pageMicroflow);
                            return [4 /*yield*/, processMicroflow(pageMicroflow)];
                        case 4:
                            _c.sent(); // Rekursiver Aufruf für Microflows auf der Seite
                            _c.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 3];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
        var allMicroflows, allPages, processedMicroflows, processedPages, resultMicroflows, moduleMicroflows, _i, moduleMicroflows_1, mf, uniqueMicroflows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allMicroflows = model.allMicroflows();
                    allPages = model.allPages();
                    processedMicroflows = new Set();
                    processedPages = new Set();
                    resultMicroflows = [];
                    console.log("Starte Suche nach Microflows im Modul: ".concat(modulename));
                    moduleMicroflows = allMicroflows.filter(function (mf) { var _a; return (_a = mf.qualifiedName) === null || _a === void 0 ? void 0 : _a.startsWith(modulename); });
                    console.log("Gefundene Microflows im Modul \"".concat(modulename, "\": ").concat(moduleMicroflows.length));
                    _i = 0, moduleMicroflows_1 = moduleMicroflows;
                    _a.label = 1;
                case 1:
                    if (!(_i < moduleMicroflows_1.length)) return [3 /*break*/, 4];
                    mf = moduleMicroflows_1[_i];
                    resultMicroflows.push(mf);
                    return [4 /*yield*/, processMicroflow(mf)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    uniqueMicroflows = Array.from(new Set(resultMicroflows.map(function (mf) { return mf.id; })))
                        .map(function (id) { return resultMicroflows.find(function (mf) { return mf.id === id; }); })
                        .filter(function (mf) { return mf !== undefined; });
                    console.log("Gefundene eindeutige Microflows im Modul \"".concat(modulename, "\": ").concat(uniqueMicroflows.length));
                    uniqueMicroflows.forEach(function (mf) { return console.log("Microflow: ".concat(mf === null || mf === void 0 ? void 0 : mf.name)); });
                    return [2 /*return*/, uniqueMicroflows];
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
main().catch(console.error);
