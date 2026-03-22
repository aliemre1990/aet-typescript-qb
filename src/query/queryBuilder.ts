import { DbType, dbTypes } from "../db.js";
import QueryColumn from "./queryColumn.js";
import Table, { type MapToQueryColumns } from "../table/table.js";
import { isNullOrUndefined } from "../utility/guards.js";
import type ColumnComparisonOperation from "./comparisons/_comparisonOperations.js";
import type ColumnLogicalOperation from "./logicalOperations.js";
import type { MapCtesToSelectionType, TablesToObject, TableToColumnsMap } from "./_types/miscellaneous.js";
import type { ColumnsToResultMap, QueryParamsToObject, SelectToAllColumnsMapRecursively, SelectToResultMapRecursively } from "./_types/result.js";
import QueryTable from "./queryTable.js";
import type Column from "../table/column.js";
import type { DbOperations } from "./_types/ops.js";
import QueryParam from "./param.js";
import type { DbValueTypes } from "../table/column.js";
import type { IDbType } from "./_interfaces/IDbType.js";
import type { AccumulateSubQueryParams, ConvertElementsToSubQueryCompliant, InferDbTypeFromFromFirstIDbType, MapToSubQueryObject } from "./_types/subQueryUtility.js";
import type { AccumulateComparisonParams } from "./_types/paramAccumulationComparison.js";
import type { AccumulateOrderByParams } from "./_types/paramAccumulationOrderBy.js";
import type { AccumulateColumnParams } from "./_types/paramAccumulationSelect.js";
import type ColumnsSelection from "./columnsSelection.js";
import { columnsSelectionFactory, ColumnsSelectionQueryObjectSymbol } from "./columnsSelection.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, queryBuilderContextFactory, type DetermineFinalValueType, type DetermineValueType, type IComparable, type QueryBuilderContext } from "./_interfaces/IComparable.js";
import SubQueryObject from "./subQueryObject.js";
import eq from "./comparisons/eq.js";
import sqlIn from "./comparisons/in.js";
import between from "./comparisons/between.js";
import CTEObject, { CTEObjectEntry } from "./cteObject.js";
import { mapCTESpecsToSelection } from "./utility.js";
import notEq from "./comparisons/notEq.js";
import gt from "./comparisons/gt.js";
import gte from "./comparisons/gte.js";
import lt from "./comparisons/lt.js";
import lte from "./comparisons/lte.js";
import type { PgColumnType } from "../table/columnTypes.js";
import { getDbFunctions } from "./uitlity/dbOperations.js";
import type { MapToCTEObjectForRecursive } from "./_types/cteUtility.js";
import type { UndefinedIfLengthZero } from "../utility/common.js";
import type { ExtractParams } from "./param.js";
import notBetween from "./comparisons/notBetween.js";
import isNull from "./comparisons/isNull.js";
import isNotNull from "./comparisons/isNotNull.js";

type CombineComparableItems<
    TLeft extends ResultShapeItem<any>,
    TRight extends ResultShapeItem<any>
> =
    TLeft extends IComparable<infer TDbType, any, infer TValue, infer TFinalValue, infer TName, infer TAs, infer TCastType>
    ? TRight extends IComparable<any, any, infer TValue2, infer TFinalValue2, any, any, any>
    ? IComparable<
        TDbType,
        UndefinedIfLengthZero<ExtractParams<TLeft>>,
        TValue | TValue2,
        TFinalValue | TFinalValue2,
        TName,
        TAs,
        TCastType
    >
    : never
    : never;
type CalculateCombineResultRecursively<
    TUnionSelectResult extends ResultShape<any>,
    TSelectResult extends ResultShape<any>
> =
    TSelectResult extends readonly [infer SHead, ...infer STail] ?
    TUnionSelectResult extends readonly [infer UHead, ...infer UTail] ?
    SHead extends ResultShapeItem<any> ?
    UHead extends ResultShapeItem<any> ?
    STail extends readonly [any, ...any[]] ?
    UTail extends readonly [any, ...any[]] ?
    readonly [
        CombineComparableItems<SHead, UHead>,
        ...CalculateCombineResultRecursively<STail, UTail>
    ] :
    [CombineComparableItems<SHead, UHead>] :
    [CombineComparableItems<SHead, UHead>] :
    never :
    never :
    never :
    never;

type CalculateCombineResult<
    TUnionQb extends QueryBuilder<any, any, any, any, MapQueryResultForCombine<any>, any, any, any>,
    TResult extends ResultShape<any> | undefined
> = TResult extends ResultShape<any> ?
    TUnionQb extends QueryBuilder<any, any, any, any, infer TUnionResult, any, any, any> ?
    TUnionResult extends ResultShape<any> ?
    CalculateCombineResultRecursively<TUnionResult, TResult> :
    never :
    never :
    never;

type MapQueryResultForCombineRecursively<
    TResult extends ResultShape<any>
> =
    TResult extends readonly [infer First, ...infer Rest] ?
    First extends IComparable<infer TDbType, any, infer TValueType, any, any, any, any> ?
    Rest extends readonly [any, ...any[]] ?
    [IComparable<TDbType, any, any, TValueType extends null ? any : TValueType | null, any, any, any>, ...MapQueryResultForCombineRecursively<Rest>] :
    [IComparable<TDbType, any, any, TValueType extends null ? any : TValueType | null, any, any, any>] :
    Rest extends readonly [any, ...any[]] ?
    [never, ...MapQueryResultForCombineRecursively<Rest>] :
    [never] :
    []
    ;
type MapQueryResultForCombine<
    TResult extends ResultShape<any> | undefined,
> = TResult extends undefined ? never : TResult extends ResultShape<any> ? MapQueryResultForCombineRecursively<TResult> : never;

type ResultShapeItem<TDbType extends DbType> = IComparable<TDbType, any, any, any, any, any, any>;
type ResultShape<TDbType extends DbType> = readonly ResultShapeItem<TDbType>[];

type SelectSpecsType<TDbType extends DbType> = "*" | readonly (ColumnsSelection<TDbType, any, any> | IComparable<TDbType, any, any, any, any, any, any>)[]

type FromItemType<TDbType extends DbType> = QueryTable<TDbType, any, any, any, any, any> | SubQueryObject<TDbType, any, any, string> | CTEObject<TDbType, any, any, any, any, any>;
type FromType<TDbType extends DbType> = readonly FromItemType<TDbType>[];

const orderTypes = {
    asc: 'ASC',
    desc: 'DESC'
} as const;
type OrderType = typeof orderTypes[keyof typeof orderTypes];
type OrderBySpecsType<TDbType extends DbType> = readonly (IComparable<TDbType, any, any, any, any, any, any> | [IComparable<TDbType, any, any, any, any, any, any>, OrderType])[];

const joinTypes = {
    inner: 'INNER',
    left: 'LEFT',
    right: 'RIGHT',
    full: 'FULL'
} as const;
type JoinType = typeof joinTypes[keyof typeof joinTypes];
type JoinSpecsTableType<TDbType extends DbType> = FromItemType<TDbType>;
type JoinSpecsItemType<TDbType extends DbType> = { joinType: JoinType, table: JoinSpecsTableType<TDbType>, comparison: ComparisonType<TDbType> }
type JoinSpecsType<TDbType extends DbType> = readonly JoinSpecsItemType<TDbType>[]

type GroupBySpecs<TDbType extends DbType> = readonly (ColumnsSelection<TDbType, any, any> | IComparable<TDbType, any, any, any, any, any, any>)[];

type ColumnsSelectionListType<TDbType extends DbType> = { [key: string]: ColumnsSelection<TDbType, any, any> }
type ComparisonType<TDbType extends DbType> = ColumnComparisonOperation<TDbType, any, any, any, any, any, any> | ColumnLogicalOperation<TDbType, any, any, any, any>;


const cteTypes = {
    NON_RECURSIVE: {
        name: 'NON_RECURSIVE'
    },
    RECURSIVE: {
        name: 'RECURSIVE'
    }
} as const;
type CTEType = (typeof cteTypes)[keyof typeof cteTypes];
type CTESpecsType<TDbType extends DbType> = readonly CTEObject<
    TDbType,
    string,
    CTEType,
    QueryBuilder<TDbType, any, any, any, any, QueryParam<TDbType, any, any, any, any>[] | undefined, any, any>,
    readonly CTEObjectEntry<TDbType, any, any, any, string, string | undefined, any>[],
    any
>[];

type GetFirstTypeFromResult<TDbType extends DbType, TResult extends ResultShape<TDbType> | undefined> =
    TResult extends undefined ? never :
    TResult extends ResultShape<TDbType> ?
    TResult[0] extends never ? never :
    TResult[0] extends IComparable<TDbType, any, infer TValueType, any, any, any, any> ? TValueType :
    never :
    never;

type GetFirstFinalTypeFromResult<TDbType extends DbType, TResult extends ResultShape<TDbType> | undefined> =
    TResult extends undefined ? never :
    TResult extends ResultShape<TDbType> ?
    TResult[0] extends never ? never :
    TResult[0] extends IComparable<TDbType, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType :
    never :
    never;

type GetFirstDefaultKeyFromResult<TDbType extends DbType, TResult extends ResultShape<TDbType> | undefined> =
    TResult extends undefined ? never :
    TResult extends ResultShape<TDbType> ?
    TResult[0] extends never ? never :
    TResult[0] extends IComparable<TDbType, any, any, any, any, infer TFieldKey, any> ? TFieldKey :
    never :
    never;

const unionTypes = {
    UNION: { name: 'UNION', query: 'UNION' },
    UNION_ALL: { name: 'UNION_ALL', query: 'UNION ALL' },
} as const;
type UNION_TYPE = typeof unionTypes[keyof typeof unionTypes]["name"];

const combineTypes = {
    ...unionTypes,
    INTERSECT: { name: 'INTERSECT', query: 'INTERSECT' },
    INTERSECT_ALL: { name: 'INTERSECT_ALL', query: 'INTERSECT ALL' },
    EXCEPT: { name: 'EXCEPT', query: 'EXCEPT' },
    EXCEPT_ALL: { name: 'EXCEPT_ALL', query: 'EXCEPT ALL' }
} as const;
type COMBINE_TYPE = typeof combineTypes[keyof typeof combineTypes]["name"];
type CombineSpecsType<TDbType extends DbType> = readonly { type: typeof combineTypes[keyof typeof combineTypes], qb: QueryBuilder<TDbType, any, any, any, any, any, any> }[];

const queryTypes = {
    SELECT: 'SELECT',
    UPDATE: 'UPDATE',
    INSERT: 'INSERT'
}
type QUERY_TYPE = typeof queryTypes[keyof typeof queryTypes];


class QueryBuilder<
    TDbType extends DbType,
    TFrom extends FromType<TDbType> | undefined,
    TJoinSpecs extends JoinSpecsType<TDbType> | undefined,
    TCTESpecs extends CTESpecsType<TDbType> | undefined,
    TResult extends ResultShape<TDbType> | undefined = undefined,
    TParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = undefined,
    TAs extends string | undefined = undefined,
    TCastType extends PgColumnType | undefined = undefined
>
    implements
    IDbType<TDbType>,
    IComparable<
        TDbType,
        TParams,
        DetermineValueType<TCastType, GetFirstTypeFromResult<TDbType, TResult>>,
        DetermineFinalValueType<GetFirstFinalTypeFromResult<TDbType, TResult>, DetermineValueType<TCastType, GetFirstTypeFromResult<TDbType, TResult>>>,
        GetFirstDefaultKeyFromResult<TDbType, TResult>,
        TAs,
        TCastType
    > {

    dbType: TDbType;

    [IComparableValueDummySymbol]: DetermineValueType<TCastType, GetFirstTypeFromResult<TDbType, TResult>>;
    [IComparableFinalValueDummySymbol]: DetermineFinalValueType<GetFirstFinalTypeFromResult<TDbType, TResult>, DetermineValueType<TCastType, GetFirstTypeFromResult<TDbType, TResult>>>;

    params?: TParams;
    fieldName: GetFirstDefaultKeyFromResult<TDbType, TResult>;
    asName: TAs;
    castType?: TCastType;

    eq: typeof eq = eq;
    notEq: typeof notEq = notEq;
    gt: typeof gt = gt;
    gte: typeof gte = gte;
    lt: typeof lt = lt;
    lte: typeof lte = lte;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;
    notBetween: typeof notBetween = notBetween;
    isNull: typeof isNull = isNull;
    isNotNull: typeof isNotNull = isNotNull;

    cteSpecs?: TCTESpecs;
    fromSpecs: TFrom;
    joinSpecs?: TJoinSpecs;
    whereComparison?: ComparisonType<TDbType>;
    selectResult?: TResult;
    selectSpecs?: SelectSpecsType<TDbType>;
    groupedColumns?: GroupBySpecs<TDbType>;
    havingSpec?: ComparisonType<TDbType>;
    orderBySpecs?: OrderBySpecsType<TDbType>;
    combineSpecs?: CombineSpecsType<TDbType>;

    queryType?: QUERY_TYPE;

    constructor(
        dbType: TDbType,
        fromSpecs: TFrom,
        asName: TAs,
        data?: {
            castType?: TCastType,
            queryType?: QUERY_TYPE,
            params?: TParams;
            cteSpecs?: TCTESpecs,
            joinSpecs?: TJoinSpecs,
            whereComparison?: ComparisonType<TDbType>,
            selectResult?: TResult,
            selectSpecs?: SelectSpecsType<TDbType>,
            groupedColumns?: GroupBySpecs<TDbType>,
            havingSpec?: ComparisonType<TDbType>,
            orderBySpecs?: OrderBySpecsType<TDbType>,
            combineSpecs?: CombineSpecsType<TDbType>
        }
    ) {
        this.dbType = dbType;

        this.params = data?.params;
        this.cteSpecs = data?.cteSpecs;
        this.fromSpecs = fromSpecs;
        this.joinSpecs = data?.joinSpecs;
        this.whereComparison = data?.whereComparison;
        this.selectResult = data?.selectResult;
        this.selectSpecs = data?.selectSpecs;
        this.groupedColumns = data?.groupedColumns;
        this.havingSpec = data?.havingSpec;
        this.orderBySpecs = data?.orderBySpecs;
        this.combineSpecs = data?.combineSpecs;

        this.asName = asName;
        this.castType = data?.castType;

        this.queryType = data?.queryType;

        this.fieldName = data?.selectResult !== undefined && data.selectResult.length > 0 ? data.selectResult[0].asName || data.selectResult[0].fieldName : "";

        this[IComparableValueDummySymbol] = undefined as any;
        this[IComparableFinalValueDummySymbol] = undefined as any;
    }

    as<TAs extends string>(asName: TAs) {
        return new QueryBuilder<TDbType, TFrom, TJoinSpecs, TCTESpecs, TResult, TParams, TAs, TCastType>(
            this.dbType,
            this.fromSpecs,
            asName,
            {
                castType: this.castType,
                queryType: this.queryType,
                params: this.params,
                cteSpecs: this.cteSpecs,
                joinSpecs: this.joinSpecs,
                whereComparison: this.whereComparison,
                selectResult: this.selectResult,
                selectSpecs: this.selectSpecs,
                groupedColumns: this.groupedColumns,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs,
                combineSpecs: this.combineSpecs
            });
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new QueryBuilder<TDbType, TFrom, TJoinSpecs, TCTESpecs, TResult, TParams, TAs, TCastType>(
            this.dbType,
            this.fromSpecs,
            this.asName,
            {
                castType: type,
                queryType: this.queryType,
                params: this.params,
                cteSpecs: this.cteSpecs,
                joinSpecs: this.joinSpecs,
                whereComparison: this.whereComparison,
                selectResult: this.selectResult,
                selectSpecs: this.selectSpecs,
                groupedColumns: this.groupedColumns,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs,
                combineSpecs: this.combineSpecs
            });
    }
    #getColumnsSelection() {
        let columnsSelection: ColumnsSelectionListType<TDbType> = {};
        if (this.fromSpecs !== undefined) {
            for (const spec of this.fromSpecs) {
                if (spec instanceof QueryTable) {
                    let ownerName = spec.name;
                    let selection = columnsSelectionFactory<TDbType>(spec, spec.columnsList)
                    columnsSelection[ownerName] = selection;
                } else if (spec instanceof SubQueryObject) {
                    let ownerName = spec.name;
                    let selection = columnsSelectionFactory<TDbType>(spec, spec.subQueryEntries);
                    columnsSelection[ownerName] = selection;
                } else if (spec instanceof CTEObject) {
                    let ownerName = spec.name;
                    let selection = columnsSelectionFactory(spec, spec.cteObjectEntries);
                    columnsSelection[ownerName] = selection;
                } else {
                    throw Error('Invalid from element type.')
                }
            }
        }

        if (this.joinSpecs !== undefined) {
            for (let spec of this.joinSpecs) {
                const { table } = spec;

                if (table instanceof QueryTable) {
                    let ownerName = table.name;
                    let selection = columnsSelectionFactory<TDbType>(table, table.columnsList)
                    columnsSelection[ownerName] = selection;
                } else if (table instanceof SubQueryObject) {
                    let ownerName = table.name;
                    let selection = columnsSelectionFactory<TDbType>(table, table.subQueryEntries);
                    columnsSelection[ownerName] = selection;
                } else if (table instanceof CTEObject) {
                    let ownerName = table.name;
                    let selection = columnsSelectionFactory(table, table.cteObjectEntries);
                    columnsSelection[ownerName] = selection;
                } else {
                    throw Error('Invalid from element type.')
                }
            }
        }

        return columnsSelection;
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        let result = '';

        if (this.queryType === queryTypes.SELECT) {

            if (this.selectSpecs === undefined || this.selectResult === undefined) {
                throw Error('Result not specified.');
            }

            let selectList;
            if (this.selectSpecs === "*") {
                selectList = this.selectSpecs;
            } else {
                selectList = this.selectSpecs
                    .map(sl => {
                        if (ColumnsSelectionQueryObjectSymbol in sl) {
                            return `"${sl[ColumnsSelectionQueryObjectSymbol].asName || sl[ColumnsSelectionQueryObjectSymbol].table.name}".*`;
                        }

                        return sl.buildSQL(context).query;
                    }).join(', ');
            }


            if (this.fromSpecs === undefined) {
                throw Error('From clause not specified.');
            }
            let fromClause = this.fromSpecs.map(frm => {
                if (frm instanceof QueryTable) {
                    return `"${frm.table.name}"${frm.asName === undefined ? '' : ` AS "${frm.asName}"`}`;
                }
                else if (frm instanceof CTEObject) {
                    return `"${frm.cteName}"${frm.asName === undefined ? '' : ` AS "${frm.asName}"`}`;
                } else {
                    return frm.buildSQL(context).query;
                }
            }).join(' ,');

            let joinClauses;
            if (this.joinSpecs) {
                joinClauses = this.joinSpecs.map(spec => {
                    let result = `${spec.joinType} JOIN `;

                    if (spec.table instanceof QueryTable) {
                        result = `${result}"${spec.table.table.name}"${spec.table.asName === undefined ? '' : ` AS "${spec.table.asName}"`}`;
                    } else if (spec.table instanceof CTEObject) {
                        result = `${result}"${spec.table.cteName}"${spec.table.asName === undefined ? '' : ` AS "${spec.table.asName}"`}`;
                    } else {
                        result = `${result}${spec.table.buildSQL(context).query}`;
                    }
                    result = `${result} ON ${spec.comparison.buildSQL(context).query}`;

                    return result;
                })
                    .join(' ');
            }


            let whereClause;
            if (this.whereComparison) {
                whereClause = this.whereComparison?.buildSQL(context).query;
            }

            let groupByClause;
            if (this.groupedColumns) {
                groupByClause = this.groupedColumns.map(grp => grp.buildSQL(context).query).join(', ');
            }

            let havingClause;
            if (this.havingSpec) {
                havingClause = this.havingSpec.buildSQL(context).query;
            }


            let cteClause;
            if (this.cteSpecs !== undefined) {
                const cteItems = this.cteSpecs.map(cte => {
                    let qbResult = cte.buildSQL(context);
                    let result = `${cte.cteType.name === 'RECURSIVE' ? 'RECURSIVE ' : ''}`;
                    if (cte.cteType.name === 'RECURSIVE') {

                    }

                    result = `${result}"${cte.cteName}"`;
                    if (cte.isColumnListPresent === true) {
                        const columnList = `(${cte.cteObjectEntries.map(ent => `"${ent.fieldName}"`).join(', ')})`;
                        result = `${result}${columnList}`
                    }

                    result = `${result} AS (${qbResult.query})`;

                    return result;
                }).join(', ');
                cteClause = `WITH ${cteItems}`
            }


            let unions;
            if (this.combineSpecs) {
                unions = this.combineSpecs
                    .map(spec => `${spec.type.query} (${spec.qb.buildSQL(context).query})`
                    )
                    .join('');
            }

            result =
                `${cteClause ? `${cteClause} ` : ''}` +
                `SELECT ${selectList} FROM ${fromClause}` +
                `${joinClauses ? ` ${joinClauses}` : ''}` +
                `${whereClause ? ` WHERE ${whereClause}` : ''}` +
                `${groupByClause ? ` GROUP BY ${groupByClause}` : ''}` +
                `${havingClause ? ` HAVING ${havingClause}` : ''}` +
                `${unions ? ` ${unions}` : ''}`
        }

        return { query: result, params: [...(context?.params || [])] };
    }

    select(): QueryBuilder<
        TDbType,
        TFrom,
        TJoinSpecs,
        TCTESpecs,
        SelectToAllColumnsMapRecursively<TDbType, TFrom, TJoinSpecs>,
        TParams,
        TAs,
        TCastType
    >
    select<
        const TCbResult extends readonly (ColumnsSelection<TDbType, any, any> | IComparable<TDbType, any, any, any, string, any, any> | IComparable<TDbType, any, any, any, any, string, any>)[],
        TFinalResult extends ResultShape<TDbType> = SelectToResultMapRecursively<TDbType, TCbResult>
    >(
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>,
            ops: DbOperations<TDbType>
        ) => TCbResult
    ): QueryBuilder<
        TDbType,
        TFrom,
        TJoinSpecs,
        TCTESpecs,
        TCbResult["length"] extends 0 ? SelectToAllColumnsMapRecursively<TDbType, TFrom, TJoinSpecs> : TFinalResult,
        TCbResult["length"] extends 0 ? TParams : UndefinedIfLengthZero<AccumulateColumnParams<TParams, TFinalResult>>,
        TAs,
        TCastType
    >
    select<
        const TCbResult extends readonly (ColumnsSelection<TDbType, any, any> | IComparable<TDbType, any, any, any, string, any, any> | IComparable<TDbType, any, any, any, any, string, any>)[],
        TFinalResult extends ResultShape<TDbType> = SelectToResultMapRecursively<TDbType, TCbResult>
    >(
        cb?: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>,
            ops: DbOperations<TDbType>
        ) => TCbResult
    ): QueryBuilder<
        TDbType,
        TFrom,
        TJoinSpecs,
        TCTESpecs,
        TCbResult["length"] extends 0 ? SelectToAllColumnsMapRecursively<TDbType, TFrom, TJoinSpecs> : TFinalResult,
        TCbResult["length"] extends 0 ? TParams : UndefinedIfLengthZero<AccumulateColumnParams<TParams, TFinalResult>>,
        TAs,
        TCastType
    > {

        let selectRes: readonly (ColumnsSelection<TDbType, any, any> | IComparable<TDbType, any, any, any, any, any, any>)[] = [];
        if (!isNullOrUndefined(cb)) {
            const columnsSelection = this.#getColumnsSelection() as TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>;
            const functions = getDbFunctions(this.dbType);
            selectRes = cb(columnsSelection, functions);
        }

        let params: readonly QueryParam<TDbType, any, any, any, any>[] | undefined = this.params;
        if (selectRes) {
            let tmpParams = selectRes.reduce((acc, it) => {
                if (it.params) {
                    return [...acc, ...it.params];
                } else if (it instanceof QueryParam) {
                    return [...acc, it];
                } else {
                    return acc;
                }
            }, [] as readonly QueryParam<TDbType, any, any, any, any>[]);

            params = [...(params || []), ...tmpParams];
            if (params.length === 0) {
                params = undefined;
            }
        }

        if (isNullOrUndefined(cb) || selectRes.length === 0) {

            let finalSelectRes: ResultShapeItem<TDbType>[] = [];
            if (this.fromSpecs !== undefined) {
                for (const frm of this.fromSpecs) {
                    if (frm instanceof QueryTable) {
                        finalSelectRes.push(...frm.columnsList);
                    } else if (frm instanceof SubQueryObject) {
                        finalSelectRes.push(...frm.subQueryEntries);
                    } else if (frm instanceof CTEObject) {
                        finalSelectRes.push(...frm.cteObjectEntries);
                    } else {
                        throw Error('Invalid from element type.')
                    }
                }
            }

            if (this.joinSpecs !== undefined) {
                for (const join of this.joinSpecs) {
                    const { table } = join;
                    if (table instanceof QueryTable) {
                        finalSelectRes.push(...table.columnsList);
                    } else if (table instanceof SubQueryObject) {
                        finalSelectRes.push(...table.subQueryEntries);
                    } else if (table instanceof CTEObject) {
                        finalSelectRes.push(...table.cteObjectEntries);
                    } else {
                        throw Error('Invalid from element type.')
                    }
                }
            }

            return new QueryBuilder<
                TDbType,
                TFrom,
                TJoinSpecs,
                TCTESpecs,
                TCbResult["length"] extends 0 ? SelectToAllColumnsMapRecursively<TDbType, TFrom, TJoinSpecs> : TFinalResult,
                TCbResult["length"] extends 0 ? TParams : UndefinedIfLengthZero<AccumulateColumnParams<TParams, TFinalResult>>,
                TAs,
                TCastType
            >(
                this.dbType,
                this.fromSpecs,
                this.asName,
                {
                    castType: this.castType,
                    queryType: queryTypes.SELECT,
                    params: params as TCbResult["length"] extends 0 ? TParams : UndefinedIfLengthZero<AccumulateColumnParams<TParams, TFinalResult>>,
                    cteSpecs: this.cteSpecs,
                    joinSpecs: this.joinSpecs,
                    whereComparison: this.whereComparison,
                    selectResult: finalSelectRes as ResultShape<TDbType> as TCbResult["length"] extends 0 ? SelectToAllColumnsMapRecursively<TDbType, TFrom, TJoinSpecs> : TFinalResult,
                    selectSpecs: "*",
                    groupedColumns: this.groupedColumns,
                    havingSpec: this.havingSpec,
                    orderBySpecs: this.orderBySpecs,
                    combineSpecs: this.combineSpecs
                });

        } else {
            let finalSelectRes: ResultShapeItem<TDbType>[] = [];
            for (const it of selectRes) {
                if (ColumnsSelectionQueryObjectSymbol in it) {
                    for (const k in it) {
                        let comparable = it[k] as IComparable<TDbType, any, any, any, any, any, any>;
                        finalSelectRes.push(comparable);
                    }
                } else {
                    finalSelectRes.push(it);
                }
            }

            return new QueryBuilder<
                TDbType,
                TFrom,
                TJoinSpecs,
                TCTESpecs,
                TCbResult["length"] extends 0 ? SelectToAllColumnsMapRecursively<TDbType, TFrom, TJoinSpecs> : TFinalResult,
                TCbResult["length"] extends 0 ? TParams : UndefinedIfLengthZero<AccumulateColumnParams<TParams, TFinalResult>>,
                TAs,
                TCastType
            >(
                this.dbType,
                this.fromSpecs,
                this.asName,
                {
                    castType: this.castType,
                    queryType: queryTypes.SELECT,
                    params: params as TCbResult["length"] extends 0 ? TParams : UndefinedIfLengthZero<AccumulateColumnParams<TParams, TFinalResult>>,
                    cteSpecs: this.cteSpecs,
                    joinSpecs: this.joinSpecs,
                    whereComparison: this.whereComparison,
                    selectResult: finalSelectRes as ResultShape<TDbType> as TCbResult["length"] extends 0 ? SelectToAllColumnsMapRecursively<TDbType, TFrom, TJoinSpecs> : TFinalResult,
                    selectSpecs: selectRes,
                    groupedColumns: this.groupedColumns,
                    havingSpec: this.havingSpec,
                    orderBySpecs: this.orderBySpecs,
                    combineSpecs: this.combineSpecs
                });

        }
    };


    join<
        TJoinType extends JoinType,
        TJoinTable extends Table<TDbType, any, any> | QueryTable<TDbType, any, any, any, any, any> | QueryBuilder<TDbType, any, any, any, any, any, string, any> | CTEObject<TDbType, any, any, any, any, any>,
        TCbResult extends ComparisonType<TDbType>,
        TJoinResult extends JoinSpecsTableType<TDbType> =
        TJoinTable extends Table<TDbType, infer TJoinCols, infer TJoinTableName> ?
        QueryTable<
            TDbType,
            TJoinCols,
            TJoinTableName,
            Table<TDbType, TJoinCols, TJoinTableName>,
            MapToQueryColumns<TDbType, TDbType, TJoinCols>
        > :
        TJoinTable extends QueryBuilder<TDbType, any, any, any, any, any, string, any> ? MapToSubQueryObject<TDbType, TJoinTable> :
        TJoinTable extends CTEObject<TDbType, any, any, any, any, any> ? TJoinTable :
        TJoinTable,
        TJoinParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = UndefinedIfLengthZero<AccumulateSubQueryParams<TDbType, [TJoinResult], AccumulateComparisonParams<TCbResult, TParams>>>,
        const TJoinAccumulated extends JoinSpecsType<TDbType> = readonly [...(TJoinSpecs extends undefined ? [] : TJoinSpecs), { joinType: TJoinType, table: TJoinResult, comparison: ComparisonType<TDbType> }]
    >(
        type: TJoinType,
        tableSelection: TJoinTable | ((ctes: MapCtesToSelectionType<TDbType, TCTESpecs>) => TJoinTable),
        comparisonCb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinAccumulated>>,
            ops: DbOperations<TDbType>
        ) => TCbResult
    ): QueryBuilder<TDbType, TFrom, TJoinAccumulated, TCTESpecs, TResult, TJoinParams, TAs, TCastType> {

        let table;

        if (typeof tableSelection === "function") {
            let cteSpecs = {} as MapCtesToSelectionType<TDbType, TCTESpecs>;
            if (this.cteSpecs !== undefined) {
                cteSpecs = mapCTESpecsToSelection(this.cteSpecs) as MapCtesToSelectionType<TDbType, TCTESpecs>;
            }
            table = tableSelection(cteSpecs);
        } else {
            table = tableSelection;
        }

        let columnsSelection = this.#getColumnsSelection();

        let params: readonly QueryParam<TDbType, any, any, any, any>[] | undefined = this.params;
        let joinParams: readonly QueryParam<TDbType, any, any, any, any>[] | undefined = undefined;
        let joinTable: TJoinResult;
        if (table instanceof Table) {
            const queryColumns = table.columnsList.map((col: Column<TDbType, any, any, any, any, any, any>) => {
                return new QueryColumn(table.dbType, col, { tableName: table.name }, undefined);
            }) as QueryColumn<TDbType, any, any, any, any, any, any>[];

            let res = new QueryTable(table.dbType, table, queryColumns);
            let ownerName = res.name;
            let selection = columnsSelectionFactory<TDbType>(res, res.columnsList);

            joinTable = res as TJoinResult;
            columnsSelection = {
                ...columnsSelection,
                [ownerName]: selection
            }
        } else if (table instanceof QueryTable) {
            joinTable = table as QueryTable<TDbType, any, any, any, any, any> as TJoinResult;
            let ownerName = joinTable.name;
            let selection = columnsSelectionFactory<TDbType>(table, table.columnsList)

            columnsSelection = {
                ...columnsSelection,
                [ownerName]: selection
            }
        } else if (table instanceof QueryBuilder) {
            let tmpTable: SubQueryObject<TDbType, any, any, any> = new SubQueryObject(this.dbType, table);

            let ownerName = tmpTable.name;
            let selection = columnsSelectionFactory<TDbType>(tmpTable, tmpTable.subQueryEntries);

            columnsSelection = {
                ...columnsSelection,
                [ownerName]: selection
            }

            joinTable = tmpTable as TJoinResult;

            joinParams = table.params;
        } else if (table instanceof CTEObject) {
            let ownerName = table.name;
            let selection = columnsSelectionFactory<TDbType>(table, table.cteObjectEntries);

            joinTable = table as CTEObject<TDbType, any, any, any, any, any> as TJoinResult;

            columnsSelection = {
                ...columnsSelection,
                [ownerName]: selection
            }
        } else {
            throw Error('Invalid table type.');
        }

        const dbOperators = getDbFunctions(this.dbType);

        const comparison = comparisonCb(
            columnsSelection as TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinAccumulated>>,
            dbOperators
        );

        // Comparison params should come before join table params to match TParams.
        params = [...(params || []), ...(comparison.params || []), ...(joinParams || [])];
        if (params.length === 0) {
            params = undefined;
        }


        const newJoinSpec = { joinType: type, table: joinTable, comparison };
        let mergedJoinSpecs: JoinSpecsType<TDbType> = [];
        if (this.joinSpecs === undefined) {
            mergedJoinSpecs = [newJoinSpec];
        } else {
            const existingIndex = this.joinSpecs.findIndex(spec => spec.table.name === joinTable.name);
            mergedJoinSpecs = existingIndex >= 0 ? [...this.joinSpecs.toSpliced(existingIndex, 1), newJoinSpec] : [...this.joinSpecs, newJoinSpec];
        }

        return new QueryBuilder<TDbType, TFrom, TJoinAccumulated, TCTESpecs, TResult, TJoinParams, TAs, TCastType>(
            this.dbType,
            this.fromSpecs,
            this.asName,
            {
                castType: this.castType,
                queryType: this.queryType,
                params: params as TJoinParams,
                cteSpecs: this.cteSpecs,
                joinSpecs: mergedJoinSpecs as TJoinAccumulated,
                whereComparison: this.whereComparison,
                selectResult: this.selectResult,
                selectSpecs: this.selectSpecs,
                groupedColumns: this.groupedColumns,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs,
                combineSpecs: this.combineSpecs
            })
    }

    where<
        TCbResult extends ComparisonType<TDbType>
    >(
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>,
            ops: DbOperations<TDbType>
        ) => TCbResult
    ):
        QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TCTESpecs,
            TResult,
            AccumulateComparisonParams<TCbResult, TParams>,
            TAs,
            TCastType
        > {
        const columnsSelection = this.#getColumnsSelection() as TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>;
        const ops = getDbFunctions(this.dbType);

        const comparison = cb(columnsSelection, ops as DbOperations<TDbType>)

        let params: readonly QueryParam<TDbType, any, any, any, any>[] | undefined = this.params;
        params = [...(params || []), ...(comparison.params || [])];
        if (params.length === 0) {
            params = undefined;
        }

        return new QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TCTESpecs,
            TResult,
            AccumulateComparisonParams<TCbResult, TParams>,
            TAs,
            TCastType
        >(
            this.dbType,
            this.fromSpecs,
            this.asName,
            {
                castType: this.castType,
                queryType: this.queryType,
                cteSpecs: this.cteSpecs,
                joinSpecs: this.joinSpecs,
                whereComparison: comparison,
                selectResult: this.selectResult,
                selectSpecs: this.selectSpecs,
                groupedColumns: this.groupedColumns,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs,
                combineSpecs: this.combineSpecs
            });
    }

    groupBy<
        const TCbResult extends GroupBySpecs<TDbType>
    >(cb: (
        tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>,
        ops: DbOperations<TDbType>
    ) => TCbResult):
        QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TCTESpecs,
            TResult,
            AccumulateColumnParams<TParams, TCbResult>,
            TAs,
            TCastType
        > {

        const columnsSelection = this.#getColumnsSelection() as TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs, TCTESpecs>>;
        const functions = getDbFunctions(this.dbType);
        const res = cb(columnsSelection, functions);

        let params: readonly QueryParam<TDbType, any, any, any, any>[] | undefined = this.params;
        let groupByParams: readonly QueryParam<TDbType, any, any, any, any>[] = res.reduce((acc, it) => {
            if (it.params) {
                return [...acc, ...it.params];
            } else if (it instanceof QueryParam) {
                return [...acc, it];
            } else {
                return acc;
            }
        }, [] as readonly QueryParam<TDbType, any, any, any, any>[]);
        params = [...(params || []), ...groupByParams];
        if (params.length === 0) {
            params = undefined;
        }

        return new QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TCTESpecs,
            TResult,
            AccumulateColumnParams<TParams, TCbResult>,
            TAs,
            TCastType
        >(
            this.dbType,
            this.fromSpecs,
            this.asName,
            {
                castType: this.castType,
                queryType: this.queryType,
                params: params as AccumulateColumnParams<TParams, TCbResult>,
                cteSpecs: this.cteSpecs,
                joinSpecs: this.joinSpecs,
                whereComparison: this.whereComparison,
                selectResult: this.selectResult,
                selectSpecs: this.selectSpecs,
                groupedColumns: res,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs,
                combineSpecs: this.combineSpecs
            });
    }

    having<
        TCbResult extends ComparisonType<TDbType>
    >(
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>,
            ops: DbOperations<TDbType>
        ) => TCbResult
    ): QueryBuilder<
        TDbType,
        TFrom,
        TJoinSpecs,
        TCTESpecs,
        TResult,
        AccumulateComparisonParams<TCbResult, TParams>,
        TAs,
        TCastType
    > {
        const columnsSelection = this.#getColumnsSelection() as TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs, TCTESpecs>>;
        const operators = getDbFunctions(this.dbType);
        const res = cb(columnsSelection, operators);

        let params: readonly QueryParam<TDbType, any, any, any, any>[] | undefined = this.params;
        params = [...(params || []), ...(res.params || [])];
        if (params.length === 0) {
            params = undefined;
        }

        return new QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TCTESpecs,
            TResult,
            AccumulateComparisonParams<TCbResult, TParams>,
            TAs,
            TCastType
        >(
            this.dbType,
            this.fromSpecs,
            this.asName,
            {
                castType: this.castType,
                queryType: this.queryType,
                params: params as AccumulateComparisonParams<TCbResult, TParams>,
                cteSpecs: this.cteSpecs,
                joinSpecs: this.joinSpecs,
                whereComparison: this.whereComparison,
                selectResult: this.selectResult,
                selectSpecs: this.selectSpecs,
                groupedColumns: this.groupedColumns,
                havingSpec: res,
                orderBySpecs: this.orderBySpecs,
                combineSpecs: this.combineSpecs
            });
    }

    orderBy<
        const TCbResult extends OrderBySpecsType<TDbType>
    >(
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>,
            ops: DbOperations<TDbType>
        ) => TCbResult
    ):
        QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TCTESpecs,
            TResult,
            AccumulateOrderByParams<TDbType, TParams, TCbResult>,
            TAs,
            TCastType
        > {
        const columnsSelection = this.#getColumnsSelection() as TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs, TCTESpecs>>;
        const functions = getDbFunctions(this.dbType);
        const res = cb(columnsSelection, functions);

        let params: readonly QueryParam<TDbType, any, any, any, any>[] | undefined = this.params;
        let orderByParams: readonly QueryParam<TDbType, any, any, any, any>[] = res.reduce((acc, it) => {
            if (Array.isArray(it)) {
                let comparable = it[0];
                if (comparable.params) {
                    return [...acc, ...comparable.params];
                } else if (comparable instanceof QueryParam) {
                    return [...acc, comparable];
                } else {
                    return acc;
                }
            } else {
                if (it.params) {
                    return [...acc, ...it.params];
                } else if (it instanceof QueryParam) {
                    return [...acc, it];
                } else {
                    return acc;
                }
            }
        }, [] as readonly QueryParam<TDbType, any, any, any, any>[]);
        params = [...(params || []), ...orderByParams];
        if (params.length === 0) {
            params = undefined;
        }

        return new QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TCTESpecs,
            TResult,
            AccumulateOrderByParams<TDbType, TParams, TCbResult>,
            TAs,
            TCastType
        >(
            this.dbType,
            this.fromSpecs,
            this.asName,
            {
                castType: this.castType,
                queryType: this.queryType,
                params: params as AccumulateOrderByParams<TDbType, TParams, TCbResult>,
                cteSpecs: this.cteSpecs,
                joinSpecs: this.joinSpecs,
                whereComparison: this.whereComparison,
                selectResult: this.selectResult,
                selectSpecs: this.selectSpecs,
                groupedColumns: this.groupedColumns,
                havingSpec: this.havingSpec,
                orderBySpecs: res,
                combineSpecs: this.combineSpecs
            });
    }

    from<
        const TSelected extends readonly (
            Table<TDbType, any, any> |
            QueryTable<TDbType, any, any, any, any, any> |
            QueryBuilder<TDbType, any, any, any, any, any, string, any> |
            CTEObject<TDbType, any, any, any, any, any>
        )[],
        TFromRes extends FromType<TDbType> = ConvertElementsToSubQueryCompliant<TDbType, TSelected>,
        AccumulatedParams extends readonly QueryParam<TDbType, any, any, any, any>[] = AccumulateSubQueryParams<TDbType, TFromRes, TParams>,
        AccumulatedParamsResult extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = AccumulatedParams["length"] extends 0 ? undefined : AccumulatedParams

    >(
        ...tables: TSelected
    ):
        QueryBuilder<
            TDbType,
            TFromRes,
            TJoinSpecs,
            TCTESpecs,
            TResult,
            AccumulatedParamsResult,
            TAs,
            TCastType
        >
    from<
        const TSelected extends readonly (
            Table<TDbType, any, any> |
            QueryTable<TDbType, any, any, any, any, any> |
            QueryBuilder<TDbType, any, any, any, any, any, string, any> |
            CTEObject<TDbType, any, any, any, any, any>
        )[],
        TFromRes extends FromType<TDbType> = ConvertElementsToSubQueryCompliant<TDbType, TSelected>,
        AccumulatedParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = UndefinedIfLengthZero<AccumulateSubQueryParams<TDbType, TFromRes, TParams>>
    >(
        cteSelection: ((ctes: MapCtesToSelectionType<TDbType, TCTESpecs>) => TSelected)
    ):
        QueryBuilder<
            TDbType,
            TFromRes,
            TJoinSpecs,
            TCTESpecs,
            TResult,
            AccumulatedParams,
            TAs,
            TCastType
        >
    from(
        ...args: any
    ) {

        let res: (
            Table<TDbType, any, any> |
            QueryTable<TDbType, any, any, any, any, any> |
            QueryBuilder<TDbType, any, any, any, any, any, string, any> |
            CTEObject<TDbType, any, any, any, any, any>
        )[];

        if (typeof args[0] === "function") {
            let cteSpecs: MapCtesToSelectionType<TDbType, TCTESpecs>;
            if (this.cteSpecs === undefined) {
                cteSpecs = {} as MapCtesToSelectionType<TDbType, TCTESpecs>;
            } else {
                cteSpecs = mapCTESpecsToSelection(this.cteSpecs);
            }
            res = args[0](cteSpecs);
        } else {
            res = args;
        }

        let params: readonly QueryParam<TDbType, any, any, any, any>[] | undefined = this.params;
        let fromParams: readonly QueryParam<TDbType, any, any, any, any>[] = [];
        const fromResult = res.map(item => {
            if (item instanceof Table) {
                const queryColumns = item.columnsList.map((col: Column<TDbType, any, any, any, any, any, any>) => {
                    return new QueryColumn(item.dbType, col, { tableName: item.name }, undefined);
                }) as QueryColumn<TDbType, any, any, any, any, any, any>[];

                return new QueryTable(item.dbType, item, queryColumns);
            } if (item instanceof QueryBuilder) {
                fromParams = [...(fromParams || []), ...(item.params || [])];

                return new SubQueryObject(item.dbType, item);
            }
            else {
                return item;
            }
        });
        params = [...(params || []), ...fromParams];
        if (params.length === 0) {
            params = undefined;
        }

        return new QueryBuilder<TDbType, any, any, any, any, any, any, any>(
            this.dbType,
            fromResult,
            this.asName,
            {
                castType: this.castType,
                queryType: this.queryType,
                params: params,
                cteSpecs: this.cteSpecs,
                joinSpecs: this.joinSpecs,
                whereComparison: this.whereComparison,
                selectResult: this.selectResult,
                selectSpecs: this.selectSpecs,
                groupedColumns: this.groupedColumns,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs,
                combineSpecs: this.combineSpecs
            })
    }

    withAs<
        TCTEName extends string,
        TQb extends QueryBuilder<TDbType, any, any, any, any, any, any, any>,
        TCTEObject extends CTEObject<TDbType, any, any, any, any, any> = CTEObject<TDbType, TCTEName, typeof cteTypes.NON_RECURSIVE, TQb>,
        TFinalCTESpec extends readonly CTEObject<TDbType, any, any, any, any, any>[] = readonly [...(TCTESpecs extends CTESpecsType<TDbType> ? TCTESpecs : []), TCTEObject],
        TCTEParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TQb extends QueryBuilder<TDbType, any, any, any, any, infer TParams, any, any> ? TParams : never,
        TParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = UndefinedIfLengthZero<
            [
                ...(TParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TParams : []),
                ...(TCTEParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TCTEParams : [])
            ]>
    >(
        as: TCTEName,
        pick: TQb | ((ctes: MapCtesToSelectionType<TDbType, TCTESpecs>) => TQb)
    ):
        QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TFinalCTESpec,
            TResult,
            TParamsAccumulated,
            TAs,
            TCastType
        > {

        let res: TQb;
        if (typeof pick === "function") {

            let cteSelection: MapCtesToSelectionType<TDbType, TCTESpecs>;
            if (this.cteSpecs === undefined) {
                cteSelection = {} as MapCtesToSelectionType<TDbType, TCTESpecs>;
            } else {
                cteSelection = mapCTESpecsToSelection(this.cteSpecs);
            }
            res = pick(cteSelection);
        } else {
            res = pick;
        }

        let newCteSpecs = [...(this.cteSpecs || [] as CTESpecsType<TDbType>)];
        const newSpec = new CTEObject(this.dbType, res, as, cteTypes.NON_RECURSIVE);

        let foundIndex = newCteSpecs.findIndex(spec => spec.name === newSpec.name) || -1;
        if (foundIndex >= 0) {
            newCteSpecs.toSpliced(foundIndex, 1);
        }
        newCteSpecs.push(newSpec);

        let params: readonly QueryParam<TDbType, any, any, any, any>[] | undefined = this.params;
        params = [...(params || []), ...(res.params || [])];
        if (params.length === 0) {
            params = undefined;
        }

        return new QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TFinalCTESpec,
            TResult,
            TParamsAccumulated,
            TAs,
            TCastType
        >(
            this.dbType,
            this.fromSpecs,
            this.asName,
            {
                castType: this.castType,
                queryType: this.queryType,
                params: params as TParamsAccumulated,
                cteSpecs: newCteSpecs as CTESpecsType<TDbType> as TFinalCTESpec,
                joinSpecs: this.joinSpecs,
                whereComparison: this.whereComparison,
                selectResult: this.selectResult,
                groupedColumns: this.groupedColumns,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs,
                combineSpecs: this.combineSpecs
            }
        );
    }

    withRecursiveAs<
        TCTEName extends string,
        const TColumnNames extends readonly string[],
        TAnchorQb extends QueryBuilder<TDbType, any, any, any, any, any, any, any>,
        TRecursivePartResult extends QueryBuilder<
            TDbType,
            any,
            any,
            any,
            MapQueryResultForCombine<TAnchorQb extends QueryBuilder<any, any, any, any, infer TResult, any, any, any> ? TResult : never>,
            any,
            any,
            any
        >,
        TFinalCTE extends CTEObject<TDbType, any, any, any, any, any> = MapToCTEObjectForRecursive<TDbType, TCTEName, typeof cteTypes.RECURSIVE, TColumnNames, TAnchorQb>,
        TFinalCTESpecs extends readonly CTEObject<TDbType, any, any, any, any, any>[] = readonly [...(TCTESpecs extends CTESpecsType<TDbType> ? TCTESpecs : []), TFinalCTE],
        TAnchorParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TAnchorQb extends QueryBuilder<TDbType, any, any, any, any, infer TParams, any, any> ? TParams : never,
        TRecursiveParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TRecursivePartResult extends QueryBuilder<TDbType, any, any, any, any, infer TParams, any, any> ? TParams : never,
        TParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = UndefinedIfLengthZero<[
            ...(TParams extends undefined ? [] : TParams),
            ...(TAnchorParams extends undefined ? [] : TAnchorParams),
            ...(TRecursiveParams extends undefined ? [] : TRecursiveParams)
        ]>
    >(
        cteName: TCTEName,
        columnNames: TColumnNames,
        anchorTable: TAnchorQb | ((ctes: MapCtesToSelectionType<TDbType, TCTESpecs>) => TAnchorQb),
        unionType: UNION_TYPE,
        recursivePart: (self: TFinalCTE, tables: MapCtesToSelectionType<TDbType, TCTESpecs>) => TRecursivePartResult

    ): QueryBuilder<
        TDbType,
        TFrom,
        TJoinSpecs,
        TFinalCTESpecs,
        TResult,
        TParamsAccumulated,
        TAs,
        TCastType
    > {
        let cteSelection: MapCtesToSelectionType<TDbType, TCTESpecs>;
        if (this.cteSpecs === undefined) {
            cteSelection = {} as MapCtesToSelectionType<TDbType, TCTESpecs>;
        } else {
            cteSelection = mapCTESpecsToSelection(this.cteSpecs);
        }

        let anchorQb;
        if (typeof anchorTable === "function") {
            anchorQb = anchorTable(cteSelection);
        } else {
            anchorQb = anchorTable;
        }

        let cte: TFinalCTE;
        let finalCTEentries: CTEObjectEntry<TDbType, any, any, any, any, any, any>[] = [];
        if (columnNames.length === 0) {
            cte = new CTEObject(anchorQb.dbType, anchorQb, cteName, cteTypes.RECURSIVE) as TFinalCTE;
        } else {
            let selectResult = anchorQb.selectResult;
            if (selectResult === undefined) {
                throw Error("Column list must match the selected columns.");
            }

            if (selectResult.length !== columnNames.length) {
                throw Error("Column list must match the selected columns.");
            }

            for (let i = 0; i < columnNames.length; i++) {
                let currName = columnNames[i];
                let currComp = selectResult[i];

                finalCTEentries.push(new CTEObjectEntry(anchorQb.dbType, currComp, undefined, cteName, currName));
            }

            cte = new CTEObject(anchorQb.dbType, anchorQb, cteName, cteTypes.RECURSIVE, finalCTEentries) as TFinalCTE;
        }

        let recursiveQb = recursivePart(cte, cteSelection);

        let finalQb: QueryBuilder<TDbType, any, any, any, any, any, any, any>;
        if (unionType === "UNION") {
            finalQb = anchorQb.union(() => recursiveQb);
        } else {
            finalQb = anchorQb.unionAll(() => recursiveQb);
        }

        const cteObject = new CTEObject(
            anchorQb.dbType,
            finalQb,
            cteName,
            cteTypes.RECURSIVE,
            finalCTEentries.length === 0 ? undefined : finalCTEentries, // Override entries from column list if specified
            undefined,
            finalCTEentries.length === 0 ? false : true
        ) as TFinalCTE;
        let finalCTEs: CTESpecsType<TDbType>;
        if (this.cteSpecs) {
            finalCTEs = [...this.cteSpecs, cteObject]
        } else {
            finalCTEs = [cteObject];
        }

        let params: readonly QueryParam<TDbType, any, any, any, any>[] | undefined = this.params;
        params = [...(params || []), ...(finalQb.params || [])];
        if (params.length === 0) {
            params = undefined;
        }

        return new QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TFinalCTESpecs,
            TResult,
            TParamsAccumulated,
            TAs,
            TCastType
        >(
            this.dbType,
            this.fromSpecs,
            this.asName,
            {
                castType: this.castType,
                queryType: this.queryType,
                params: params as TParamsAccumulated,
                cteSpecs: finalCTEs as TFinalCTESpecs,
                joinSpecs: this.joinSpecs,
                whereComparison: this.whereComparison,
                selectResult: this.selectResult,
                groupedColumns: this.groupedColumns,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs,
                combineSpecs: this.combineSpecs
            }
        );
    }

    #combine <
        TCombineType extends COMBINE_TYPE,
        TQbResult extends QueryBuilder<TDbType, any, any, any, MapQueryResultForCombine<TResult>, any, any, any>,
        TCombineParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TQbResult extends QueryBuilder<TDbType, any, any, any, any, infer TParams, any, any> ? TParams : never,
        TParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] =
        [
            ...(TParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TParams : []),
            ...(TCombineParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TCombineParams : [])
        ],
        TFinalParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TParamsAccumulated["length"] extends 0 ? undefined : TParamsAccumulated

    >(
        combineType: TCombineType,
        qbSelectionCb: (ctes: MapCtesToSelectionType<TDbType, TCTESpecs>) => TQbResult
    ): QueryBuilder<
        TDbType,
        TFrom,
        TJoinSpecs,
        TCTESpecs,
        CalculateCombineResult<TQbResult, TResult>,
        TFinalParamsAccumulated,
        TAs,
        TCastType
    >
    #combine <
        TCombineType extends COMBINE_TYPE,
        TQbResult extends QueryBuilder<TDbType, any, any, any, MapQueryResultForCombine<TResult>, any, any, any>,
        TCombineParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TQbResult extends QueryBuilder<TDbType, any, any, any, any, infer TParams, any, any> ? TParams : never,
        TParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] =
        [
            ...(TParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TParams : []),
            ...(TCombineParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TCombineParams : [])
        ],
        TFinalParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TParamsAccumulated["length"] extends 0 ? undefined : TParamsAccumulated

    >(
        combineType: TCombineType,
        qbSelectionCb: TQbResult
    ): QueryBuilder<
        TDbType,
        TFrom,
        TJoinSpecs,
        TCTESpecs,
        CalculateCombineResult<TQbResult, TResult>,
        TFinalParamsAccumulated,
        TAs,
        TCastType
    >
    #combine <
        TCombineType extends COMBINE_TYPE,
        TQbResult extends QueryBuilder<TDbType, any, any, any, MapQueryResultForCombine<TResult>, any, any, any>,
        TCombineParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TQbResult extends QueryBuilder<TDbType, any, any, any, any, infer TParams, any, any> ? TParams : never,
        TParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] =
        [
            ...(TParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TParams : []),
            ...(TCombineParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TCombineParams : [])
        ],
        TFinalParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TParamsAccumulated["length"] extends 0 ? undefined : TParamsAccumulated

    >(
        combineType: TCombineType,
        cteSelectionCb: TQbResult | ((ctes: MapCtesToSelectionType<TDbType, TCTESpecs>) => TQbResult)
    ): QueryBuilder<
        TDbType,
        TFrom,
        TJoinSpecs,
        TCTESpecs,
        CalculateCombineResult<TQbResult, TResult>,
        TFinalParamsAccumulated,
        TAs,
        TCastType
    > {
        let res: TQbResult;
        if (typeof cteSelectionCb === "function") {
            let cteSpecs: MapCtesToSelectionType<TDbType, TCTESpecs>;
            if (this.cteSpecs === undefined) {
                cteSpecs = {} as MapCtesToSelectionType<TDbType, TCTESpecs>;
            } else {
                cteSpecs = mapCTESpecsToSelection(this.cteSpecs);
            }
            res = cteSelectionCb(cteSpecs);
        } else {
            res = cteSelectionCb;
        }

        let actualCombineType = Object.entries(combineTypes).find(ent => ent[1].name === combineType)?.[1];
        if (isNullOrUndefined(actualCombineType)) {
            throw Error('Invalid combine type.')
        }

        let newCombine = { type: actualCombineType, qb: res };

        let newCombineSpecs: CombineSpecsType<TDbType> = [newCombine];
        if (this.combineSpecs !== undefined) {
            newCombineSpecs = [...this.combineSpecs, ...newCombineSpecs];
        }

        let params: readonly QueryParam<TDbType, any, any, any, any>[] | undefined = this.params;
        params = [...(params || []), ...(res.params || [])];
        if (params.length === 0) {
            params = undefined;
        }

        return new QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TCTESpecs,
            CalculateCombineResult<TQbResult, TResult>,
            TFinalParamsAccumulated,
            TAs,
            TCastType
        >(
            this.dbType,
            this.fromSpecs,
            this.asName,
            {
                castType: this.castType,
                queryType: this.queryType,
                params: params as TFinalParamsAccumulated,
                cteSpecs: this.cteSpecs,
                joinSpecs: this.joinSpecs,
                whereComparison: this.whereComparison,
                selectResult: this.selectResult as CalculateCombineResult<TQbResult, TResult>,
                selectSpecs: this.selectSpecs,
                groupedColumns: this.groupedColumns,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs,
                combineSpecs: newCombineSpecs
            });
    }


    union<
        TQbResult extends QueryBuilder<TDbType, any, any, any, MapQueryResultForCombine<TResult>, any, any, any>,
        TCombineParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TQbResult extends QueryBuilder<TDbType, any, any, any, any, infer TParams, any, any> ? TParams : never,
        TParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] =
        [
            ...(TParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TParams : []),
            ...(TCombineParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TCombineParams : [])
        ],
        TFinalParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TParamsAccumulated["length"] extends 0 ? undefined : TParamsAccumulated
    >(
        qbSelectionCb: (ctes: MapCtesToSelectionType<TDbType, TCTESpecs>) => TQbResult
    ): QueryBuilder<
        TDbType,
        TFrom,
        TJoinSpecs,
        TCTESpecs,
        CalculateCombineResult<TQbResult, TResult>,
        TFinalParamsAccumulated,
        TAs,
        TCastType
    >
    union<
        TQbResult extends QueryBuilder<TDbType, any, any, any, MapQueryResultForCombine<TResult>, any, any, any>,
        TCombineParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TQbResult extends QueryBuilder<TDbType, any, any, any, any, infer TParams, any, any> ? TParams : never,
        TParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] =
        [
            ...(TParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TParams : []),
            ...(TCombineParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TCombineParams : [])
        ],
        TFinalParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TParamsAccumulated["length"] extends 0 ? undefined : TParamsAccumulated
    >(
        qbSelectionCb: TQbResult
    ): QueryBuilder<
        TDbType,
        TFrom,
        TJoinSpecs,
        TCTESpecs,
        CalculateCombineResult<TQbResult, TResult>,
        TFinalParamsAccumulated,
        TAs,
        TCastType
    >
    union<
        TQbResult extends QueryBuilder<TDbType, any, any, any, MapQueryResultForCombine<TResult>, any, any, any>,
        TCombineParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TQbResult extends QueryBuilder<TDbType, any, any, any, any, infer TParams, any, any> ? TParams : never,
        TParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] =
        [
            ...(TParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TParams : []),
            ...(TCombineParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TCombineParams : [])
        ],
        TFinalParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TParamsAccumulated["length"] extends 0 ? undefined : TParamsAccumulated
    >(
        cb: (ctes: MapCtesToSelectionType<TDbType, TCTESpecs>) => TQbResult
    ): QueryBuilder<
        TDbType,
        TFrom,
        TJoinSpecs,
        TCTESpecs,
        CalculateCombineResult<TQbResult, TResult>,
        TFinalParamsAccumulated,
        TAs,
        TCastType
    > {
        return this.#combine(combineTypes.UNION.name, cb);
    }

    unionAll<
        TQbResult extends QueryBuilder<TDbType, any, any, any, MapQueryResultForCombine<TResult>, any, any, any>,
        TCombineParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TQbResult extends QueryBuilder<TDbType, any, any, any, any, infer TParams, any, any> ? TParams : never,
        TParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] =
        [
            ...(TParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TParams : []),
            ...(TCombineParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TCombineParams : [])
        ],
        TFinalParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TParamsAccumulated["length"] extends 0 ? undefined : TParamsAccumulated
    >(
        cb: (ctes: MapCtesToSelectionType<TDbType, TCTESpecs>) => TQbResult
    ): QueryBuilder<
        TDbType,
        TFrom,
        TJoinSpecs,
        TCTESpecs,
        CalculateCombineResult<TQbResult, TResult>,
        TFinalParamsAccumulated,
        TAs,
        TCastType
    >
    unionAll<
        TQbResult extends QueryBuilder<TDbType, any, any, any, MapQueryResultForCombine<TResult>, any, any, any>,
        TCombineParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TQbResult extends QueryBuilder<TDbType, any, any, any, any, infer TParams, any, any> ? TParams : never,
        TParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] =
        [
            ...(TParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TParams : []),
            ...(TCombineParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TCombineParams : [])
        ],
        TFinalParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TParamsAccumulated["length"] extends 0 ? undefined : TParamsAccumulated
    >(
        cb: TQbResult
    ): QueryBuilder<
        TDbType,
        TFrom,
        TJoinSpecs,
        TCTESpecs,
        CalculateCombineResult<TQbResult, TResult>,
        TFinalParamsAccumulated,
        TAs,
        TCastType
    >
    unionAll<
        TQbResult extends QueryBuilder<TDbType, any, any, any, MapQueryResultForCombine<TResult>, any, any, any>,
        TCombineParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TQbResult extends QueryBuilder<TDbType, any, any, any, any, infer TParams, any, any> ? TParams : never,
        TParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] =
        [
            ...(TParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TParams : []),
            ...(TCombineParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TCombineParams : [])
        ],
        TFinalParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TParamsAccumulated["length"] extends 0 ? undefined : TParamsAccumulated
    >(
        cb: (ctes: MapCtesToSelectionType<TDbType, TCTESpecs>) => TQbResult
    ): QueryBuilder<
        TDbType,
        TFrom,
        TJoinSpecs,
        TCTESpecs,
        CalculateCombineResult<TQbResult, TResult>,
        TFinalParamsAccumulated,
        TAs,
        TCastType
    > {
        return this.#combine(combineTypes.UNION_ALL.name, cb);
    }


    exec(
        ...args: TParams extends undefined
            ? [] | [{ [key: string]: any }]
            : [{ [key: string]: any } & QueryParamsToObject<TParams>]
    ):
        TResult extends ResultShape<TDbType> ?
        ColumnsToResultMap<TDbType, TResult> :
        never {


        if (isNullOrUndefined(this?.selectResult)) {
            return {} as any;
        }

        return "x" as any;
    }
}



function from<
    TFrom extends readonly (
        Table<TDbType, any, any> |
        QueryTable<TDbType, any, any, any, any, any> |
        QueryBuilder<TDbType, any, any, any, any, any, string, any> |
        CTEObject<TDbType, any, any, any, any, any>
    )[],
    TDbType extends DbType = InferDbTypeFromFromFirstIDbType<TFrom>
>(...from: TFrom) {

    type TFromRes = ConvertElementsToSubQueryCompliant<TDbType, TFrom>;

    let dbType = from[0].dbType as TDbType;

    let params: readonly QueryParam<TDbType, any, any, any, any>[] | undefined = [];
    const fromResult = from.map(item => {
        if (item instanceof Table) {

            const queryColumns = item.columnsList.map((col: Column<TDbType, any, any, any, any, any, any>) => {
                return new QueryColumn(item.dbType, col, { tableName: item.name }, undefined);
            }) as QueryColumn<TDbType, any, any, any, any, any, any>[];

            return new QueryTable(item.dbType, item, queryColumns);
        } if (item instanceof QueryBuilder) {
            params = [...(params || []), ...(item.params || [])];

            return new SubQueryObject(dbType, item);
        }
        else {
            return item;
        }
    }) as TFromRes;
    if (params?.length === 0) {
        params = undefined;
    }

    type AccumulatedParams = UndefinedIfLengthZero<AccumulateSubQueryParams<TDbType, TFromRes>>;

    return new QueryBuilder<
        TDbType,
        TFromRes,
        undefined,
        undefined,
        undefined,
        AccumulatedParams
    >(dbType, fromResult, undefined, { params: params as AccumulatedParams });
}

export default QueryBuilder;

export {
    from,
    joinTypes,
    cteTypes,
    unionTypes,
    combineTypes
}

export type {
    ResultShape,
    ResultShapeItem,
    JoinSpecsTableType,
    JoinSpecsItemType,
    JoinSpecsType,
    FromItemType,
    FromType,
    ComparisonType,
    GroupBySpecs,
    JoinType,
    OrderBySpecsType,
    OrderType,
    CTEType,
    CTESpecsType,
    COMBINE_TYPE,
    UNION_TYPE,
    MapQueryResultForCombine
}
