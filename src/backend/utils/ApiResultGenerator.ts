import { Query, QueryResult } from "pg";
import { ApiResult } from "../types/ApiResult.js";

export class ApiResultGenerator{
    
    static postResult(result: QueryResult | Error):ApiResult{
     
        let postResult: ApiResult = {
            statusCode:500,
            success: false,
            message: `Error desconocido`
        };
        if('rowCount' in result && result.rowCount && result.rowCount > 0){
            postResult = {
                statusCode: 201,
                success: true,
                message: 'Usuario creado correctamente',
                rowsAffected: result.rowCount
            } 
        };
        if (result instanceof Error && 'code' in result && result.code === "23505") {
            const detail = (result as any).detail;
            const columnMatch = detail?.match(/Key \((.*?)\)=/);
            const columnName = columnMatch ? columnMatch[1] : 'campo';
            postResult = {
                statusCode:409, 
                success: false,
                message: `El ${columnName} ya existe en la base de datos`
            };
        } 
        if (result instanceof Error && 'code' in result && result.code !== "23505") {
            postResult = {
                statusCode:500,
                success: false,
                message: `Error al insertar usuario: ${result.message}`
            };
        }
        return postResult;
    }
    
    static deleteResult(result: QueryResult | Error):ApiResult{
        
        let deleteResult: ApiResult = {
            statusCode: 500,
            success: false,
            message: `Error desconocido`
        };

        if (result instanceof Error) {
           deleteResult =  {
                statusCode: 500,
                success: false,
                message: `Error al eliminar usuario: ${result.message}`
            };
        }

        if ('rowCount' in result) {
            if (result.rowCount != null && result.rowCount > 0) {
                deleteResult = {
                    statusCode: 204,
                    success: true,
                    message: 'Usuario eliminado correctamente',
                    rowsAffected: result.rowCount
                };
            } else {
                deleteResult = {
                    statusCode: 404,
                    success: false,
                    message: 'No se encontró el usuario',
                    rowsAffected: 0
                };
            }
        }

        return deleteResult;
    }
    
}