export default class AbstractView {
    /**
     * @abstract
     * @return {string}
     */
    get template(): string;
    /**
     * @return {HTMLElement}
     */
    get el(): HTMLElement;
    _el: HTMLElement;
    /**
     * Renders element from this.template
     * @private
     * @return {HTMLElement}
     */
    private _render;
    /**
     * Method to work with element after render
     * @protected
     */
    protected _bind(): void;
}
