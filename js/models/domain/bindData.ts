import { BoardEventType } from '../../../../../assignment2/final/functional/src/board';
export class BindData<T>{
    private value:T
    private bind_value:any
    private bind_value_name:string
    constructor(v:T){
        this.value = v
    }
    bindChange(v:T){
        this.value = v
    }
    bind(bind_value:any,bind_value_name:string) {
        this.bind_value = bind_value
        this.bind_value_name = bind_value_name
    }
    changeValue(v:T){
        this.value = v
        this.bind_value[this.bind_value_name] = this.value
    }
    getValue(){
        return this.value
    }
}