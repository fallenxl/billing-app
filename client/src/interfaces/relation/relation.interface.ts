export interface IRelation {
    id: string,
    from: {
        id:string,
        entityType:string,
    }
    to:{
        id:string,
        entityType:string,
    }
    entityType:string,
    toName:string,
    label:string,
    type : string,
    additionalInfo:{
        [key:string]:string
    }
}