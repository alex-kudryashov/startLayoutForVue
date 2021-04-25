export const MainModule = {
    getClonedTemplate (templateId, selector) {
        return document
            .querySelector(templateId)
            .cloneNode(true)
            .content
            .querySelector(selector);
    }
}