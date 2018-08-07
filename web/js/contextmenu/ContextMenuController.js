"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Elements_1 = require("../util/Elements");
const ContextMenuType_1 = require("./ContextMenuType");
const MatchingSelector_1 = require("./MatchingSelector");
const AnnotationDescriptors_1 = require("../metadata/AnnotationDescriptors");
const Logger_1 = require("../logger/Logger");
const { ipcRenderer } = require('electron');
const { forDict } = require("../utils");
const { Attributes } = require("../util/Attributes");
const { TriggerEvent } = require("./TriggerEvent");
const { DocFormatFactory } = require("../docformat/DocFormatFactory");
const { DocDescriptor } = require("../metadata/DocDescriptor");
const log = Logger_1.Logger.create();
class ContextMenuController {
    constructor(model) {
        this.model = model;
        ipcRenderer.on('context-menu-command', (event, arg) => {
        });
    }
    start() {
        console.log("Starting ContextMenuController");
        document.querySelectorAll(".page").forEach((targetElement) => {
            targetElement.addEventListener("contextmenu", (event) => {
                let annotationSelectors = [".text-highlight", ".area-highlight", ".pagemark", ".page"];
                let matchingSelectors = ContextMenuController.elementsFromEventMatchingSelectors(event, annotationSelectors);
                let contextMenuTypes = [];
                forDict(matchingSelectors, function (selector, current) {
                    if (current.elements.length > 0) {
                        contextMenuTypes.push(ContextMenuController.toContextMenuType(current.selector));
                    }
                });
                let docDescriptor = new DocDescriptor({
                    fingerprint: this.model.docMeta.docInfo.fingerprint
                });
                log.info("Creating context menu for contextMenuTypes: ", contextMenuTypes);
                let pageElement = Elements_1.Elements.untilRoot(event.target, ".page");
                let docFormat = DocFormatFactory.getInstance();
                let pageNum = docFormat.getPageNumFromPageElement(pageElement);
                let eventTargetOffset = Elements_1.Elements.getRelativeOffsetRect(event.target, pageElement);
                let pageOffset = {
                    x: eventTargetOffset.left + event.offsetX,
                    y: eventTargetOffset.top + event.offsetY
                };
                ipcRenderer.send('context-menu-trigger', TriggerEvent.create({
                    point: {
                        x: event.pageX,
                        y: event.pageY
                    },
                    points: {
                        page: {
                            x: event.pageX,
                            y: event.pageY
                        },
                        client: {
                            x: event.clientX,
                            y: event.clientY
                        },
                        offset: {
                            x: event.offsetX,
                            y: event.offsetY
                        },
                        pageOffset
                    },
                    pageNum,
                    contextMenuTypes,
                    matchingSelectors,
                    docDescriptor
                }));
            });
        });
    }
    static elementsFromEvent(event) {
        let point = { x: event.clientX, y: event.clientY };
        let doc = event.target.ownerDocument;
        return doc.elementsFromPoint(point.x, point.y);
    }
    static toContextMenuType(selector) {
        let result = selector.toUpperCase();
        result = result.replace(".", "");
        result = result.replace("-", "_");
        return ContextMenuType_1.ContextMenuTypes.fromString(result);
    }
    static elementsFromEventMatchingSelectors(event, selectors) {
        let result = {};
        selectors.forEach(selector => {
            result[selector] = new MatchingSelector_1.MatchingSelector(selector, [], []);
        });
        let elements = ContextMenuController.elementsFromEvent(event);
        elements.forEach((element) => {
            selectors.forEach(selector => {
                if (element.matches(selector)) {
                    let matchingSelector = result[selector];
                    matchingSelector.elements.push(element);
                    let annotationDescriptor = AnnotationDescriptors_1.AnnotationDescriptors.createFromElement(element);
                    if (annotationDescriptor) {
                        matchingSelector.annotationDescriptors.push(annotationDescriptor);
                    }
                }
            });
        });
        return result;
    }
}
exports.ContextMenuController = ContextMenuController;
//# sourceMappingURL=ContextMenuController.js.map