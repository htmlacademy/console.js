export default class PromiseView extends ObjectView {
    _promiseValue: any;
    _promiseStatus: string;
    getPromiseStatus(): Promise<{
        status: string;
        value: any;
    } | {
        status: string;
        value: any;
    }>;
}
import ObjectView from "./object-view";
