export class inventory{
    id : string;
    code?: string;
    imageUrl ?: string;
    name : string;
    price : number;
    quantity : number;
    notification ?: boolean;

    constructor(){
        this.quantity = 0;
    }
}

export interface UserProfile {
      isAdmin? : boolean;
      email: string;  
}