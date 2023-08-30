import { ApiProperty } from "@nestjs/swagger";
import { IsOptional} from "class-validator";


export class GraficaModeloDto{

    @ApiProperty({
        description:'Termino a buscar'
    })
    @IsOptional()
    modelo?:string;
    
}