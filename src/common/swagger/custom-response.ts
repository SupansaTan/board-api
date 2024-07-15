import { getSchemaPath, ApiResponseOptions } from '@nestjs/swagger';
import { IResponse } from '../interface/response.dto';

export interface DataProperties {
  type: string;
  schemaPath?: string;
}

export const BooleanProperty: DataProperties = {
  type: 'boolean'
}

export const ObjectProperty = (schemaPath: string) => {
  return {
    type: 'object',
    schemaPath: schemaPath
  }
}

export function ApiResponseWithType(dataProperty: DataProperties): ApiResponseOptions {
  return {
    schema: {
      allOf: [
        { $ref: getSchemaPath(IResponse) },
        {
          properties: {
            data: {
              type: dataProperty.type,
              $ref: dataProperty.schemaPath ?? '',
            },
          },
        }
      ],
    },
  };
}