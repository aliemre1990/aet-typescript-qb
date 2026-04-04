import type { DbValueTypes } from "../../table/column.js";

const ValueTypeDummySymbol = Symbol();
const FinalValueTypeDummySymbol = Symbol();

interface IQueryValue<
    TFieldName extends string | undefined,
    TValueType extends DbValueTypes | null,
    TFinalValueType extends DbValueTypes | null,

> {
    [ValueTypeDummySymbol]: TValueType;
    [FinalValueTypeDummySymbol]: TFinalValueType;
    fieldName: TFieldName;
}

export type {
    IQueryValue
}

export {
    ValueTypeDummySymbol,
    FinalValueTypeDummySymbol
}