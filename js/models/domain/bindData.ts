export class BindData<T>{
    private value:T
    private bind_value:any
    private bind_value_name:string
    private f:Function

    constructor(v:T){
        this.value = v
        this.f = this.f_init
        this.f.bind(this)
    }

    f_init(v:T){
        if (this.bind_value_name!=undefined){
            this.bind_value[this.bind_value_name] = v
            //console.log(this.bind_value,this.bind_value[this.bind_value_name],v)
        }else{
            this.bind_value = v
        }
    }

    bindChange(v:T){
        this.value = v
    }

    bind(bind_value:any,bind_value_name:string=undefined,f:Function=this.f_init) {
        this.bind_value = bind_value
        this.bind_value_name = bind_value_name
        this.f = f
        this.f.bind(this)
        this.f(this.value)
    }

    changeValue(v:T){
        this.value = v
        this.f(this.value)
    }

    getValue(){
        return this.value
    }
}