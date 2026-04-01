import { DbType } from "../db.js";
import QueryColumn from "./queryColumn.js";
import Table, { type MapToQueryColumns } from "../table/table.js";
import { isNullOrUndefined } from "../utility/guards.js";
import type ColumnLogicalOperation from "./logicalOperations.js";
import type { MapCtesToSelectionType, TablesToObject, TableToColumnsMap } from "./_types/miscellaneous.js";
import type { ColumnsToResultMap, QueryParamsToObject, SelectToAllColumnsMapRecursively, SelectToResultMapRecursively } from "./_types/result.js";
import QueryTable from "./queryTable.js";
import type Column from "../table/column.js";
import type { DbOperations } from "./_types/ops.js";
import QueryParam from "./param.js";
import type { AccumulateSubQueryParams, ConvertElementsToSubQueryCompliant, InferDbTypeFromFromFirstIDbType, MapToSubQueryObject } from "./_types/subQueryUtility.js";
import type { AccumulateComparisonParams } from "./_types/paramAccumulationComparison.js";
import type { AccumulateOrderByParams } from "./_types/paramAccumulationOrderBy.js";
import type { AccumulateColumnParams } from "./_types/paramAccumulationSelect.js";
import type ColumnsSelection from "./ColumnsSelection.js";
import { columnsSelectionFactory, ColumnsSelectionQueryObjectSymbol } from "./ColumnsSelection.js";
import { queryBuilderContextFactory, type DetermineFinalValueType, type DetermineValueType, type IQueryExpression, type QueryBuilderContext } from "./_interfaces/IQueryExpression.js";
import SubQueryObject from "./subQueryObject.js";
import CTEObject, { CTEObjectEntry } from "./cteObject.js";
import { extractParams, mapCTESpecsToSelection } from "./utility.js";
import { getDbFunctions } from "./uitlity/dbOperations.js";
import type { MapToCTEObject, MapToCTEObjectForRecursive } from "./_types/cteUtility.js";
import type { UndefinedIfLengthZero } from "../utility/common.js";
import type { ExtractParams } from "./param.js";
import type BaseColumnComparisonOperation from "./_baseClasses/BaseColumnComparisonOperation.js";
import BaseQueryExpression from "./_baseClasses/BaseQueryExpression.js";
import type { withAsFnForQb, withAsMaterializedFnForQb, withAsNotMaterializedFnForQb } from "./withAsForQb.js";
import type { exceptAllFn, exceptFn, intersectAllFn, intersectFn, unionAllFn, unionFn } from "./combining.js";
import type { GetColumnTypes } from "../table/column.js";

type CombineExpressions<
    TLeft extends ResultShapeItem<any>,
    TRight extends ResultShapeItem<any>
> =
    TLeft extends IQueryExpression<infer TDbType, any, infer TValue, infer TFinalValue, infer TName, infer TAs, infer TCastType>
    ? TRight extends IQueryExpression<any, any, infer TValue2, infer TFinalValue2, any, any, any>
    ? IQueryExpression<
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
        CombineExpressions<SHead, UHead>,
        ...CalculateCombineResultRecursively<STail, UTail>
    ] :
    [CombineExpressions<SHead, UHead>] :
    [CombineExpressions<SHead, UHead>] :
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
    First extends IQueryExpression<infer TDbType, any, infer TValueType, any, any, any, any> ?
    Rest extends readonly [any, ...any[]] ?
    [IQueryExpression<TDbType, any, any, TValueType extends null ? any : TValueType | null, any, any, any>, ...MapQueryResultForCombineRecursively<Rest>] :
    [IQueryExpression<TDbType, any, any, TValueType extends null ? any : TValueType | null, any, any, any>] :
    Rest extends readonly [any, ...any[]] ?
    [never, ...MapQueryResultForCombineRecursively<Rest>] :
    [never] :
    []
    ;
type MapQueryResultForCombine<
    TResult extends ResultShape<any> | undefined,
> = TResult extends undefined ? never : TResult extends ResultShape<any> ? MapQueryResultForCombineRecursively<TResult> : never;

type ResultShapeItem<TDbType extends DbType> = IQueryExpression<TDbType, any, any, any, any, any, any>;
type ResultShape<TDbType extends DbType> = readonly ResultShapeItem<TDbType>[];

type SelectSpecsType<TDbType extends DbType> = "*" | readonly (ColumnsSelection<TDbType, any, any> | IQueryExpression<TDbType, any, any, any, any, any, any>)[]

type FromItemType<TDbType extends DbType> = QueryTable<TDbType, any, any, any, any, any> | SubQueryObject<TDbType, any, any, string> | CTEObject<TDbType, any, any, any, any>;
type FromType<TDbType extends DbType> = readonly FromItemType<TDbType>[];

const orderTypes = {
    asc: 'ASC',
    desc: 'DESC'
} as const;
type OrderType = typeof orderTypes[keyof typeof orderTypes];
type OrderBySpecsType<TDbType extends DbType> = readonly (IQueryExpression<TDbType, any, any, any, any, any, any> | [IQueryExpression<TDbType, any, any, any, any, any, any>, OrderType])[];

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

type GroupBySpecs<TDbType extends DbType> = readonly (ColumnsSelection<TDbType, any, any> | IQueryExpression<TDbType, any, any, any, any, any, any>)[];

type ColumnsSelectionListType<TDbType extends DbType> = { [key: string]: ColumnsSelection<TDbType, any, any> }
type ComparisonType<TDbType extends DbType> = BaseColumnComparisonOperation<TDbType, any, any, any, any, any, any> | ColumnLogicalOperation<TDbType, any, any, any, any>;


const cteTypes = {
    NON_RECURSIVE: {
        name: 'NON_RECURSIVE',
        query: ''
    },
    RECURSIVE: {
        name: 'RECURSIVE',
        query: 'RECURSIVE'
    },
    MATERIALIZED: {
        name: 'MATERIALIZED',
        query: 'MATERIALIZED'
    },
    NOT_MATERIALIZED: {
        name: 'NOT_MATERIALIZED',
        query: 'NOT MATERIALIZED'
    }
} as const;
type CTEType = (typeof cteTypes)[keyof typeof cteTypes];
type CTESpecsType<TDbType extends DbType> = readonly CTEObject<
    TDbType,
    string,
    QueryBuilder<TDbType, any, any, any, any, QueryParam<TDbType, any, any, any, any>[] | undefined, any, any>,
    readonly CTEObjectEntry<TDbType, any, any, any, string, string | undefined, any>[],
    any
>[];

type GetFirstTypeFromResult<TDbType extends DbType, TResult extends ResultShape<TDbType> | undefined> =
    TResult extends undefined ? never :
    TResult extends ResultShape<TDbType> ?
    TResult[0] extends never ? never :
    TResult[0] extends IQueryExpression<TDbType, any, infer TValueType, any, any, any, any> ? TValueType :
    never :
    never;

type GetFirstFinalTypeFromResult<TDbType extends DbType, TResult extends ResultShape<TDbType> | undefined> =
    TResult extends undefined ? never :
    TResult extends ResultShape<TDbType> ?
    TResult[0] extends never ? never :
    TResult[0] extends IQueryExpression<TDbType, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType :
    never :
    never;

type GetFirstDefaultKeyFromResult<TDbType extends DbType, TResult extends ResultShape<TDbType> | undefined> =
    TResult extends undefined ? never :
    TResult extends ResultShape<TDbType> ?
    TResult[0] extends never ? never :
    TResult[0] extends IQueryExpression<TDbType, any, any, any, any, infer TFieldKey, any> ? TFieldKey :
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
type CombineType = typeof combineTypes[keyof typeof combineTypes];
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
    TCastType extends GetColumnTypes<TDbType> | undefined = undefined
>
    extends
    BaseQueryExpression<
        TDbType,
        TParams,
        DetermineValueType<TDbType, TCastType, GetFirstTypeFromResult<TDbType, TResult>>,
        DetermineFinalValueType<GetFirstFinalTypeFromResult<TDbType, TResult>, DetermineValueType<TDbType, TCastType, GetFirstTypeFromResult<TDbType, TResult>>>,
        GetFirstDefaultKeyFromResult<TDbType, TResult>,
        TAs,
        TCastType
    > {

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
        castType: TCastType,
        data?: {
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
        const fieldName = data?.selectResult !== undefined && data.selectResult.length > 0 ? data.selectResult[0].asName || data.selectResult[0].fieldName : "";
        super(dbType, data?.params as TParams, fieldName, asName, castType);

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

        this.queryType = data?.queryType;
    }

    as<TAs extends string>(asName: TAs) {
        return new QueryBuilder<TDbType, TFrom, TJoinSpecs, TCTESpecs, TResult, TParams, TAs, TCastType>(
            this.dbType,
            this.fromSpecs,
            asName,
            this.castType,
            {
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
    cast<TCastType extends GetColumnTypes<TDbType>>(type: TCastType) {
        return new QueryBuilder<TDbType, TFrom, TJoinSpecs, TCTESpecs, TResult, TParams, TAs, TCastType>(
            this.dbType,
            this.fromSpecs,
            this.asName,
            type,
            {
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

                    result = `${result} AS`;
                    result = `${result} ${cte.cteType.name === "MATERIALIZED" || cte.cteType.name === "NOT_MATERIALIZED" ? cte.cteType.query : ''}`;
                    result = `${result}(${qbResult.query})`

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
        const TCbResult extends readonly (ColumnsSelection<TDbType, any, any> | IQueryExpression<TDbType, any, any, any, string, any, any> | IQueryExpression<TDbType, any, any, any, any, string, any>)[],
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
        const TCbResult extends readonly (ColumnsSelection<TDbType, any, any> | IQueryExpression<TDbType, any, any, any, string, any, any> | IQueryExpression<TDbType, any, any, any, any, string, any>)[],
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

        let selectRes: readonly (ColumnsSelection<TDbType, any, any> | IQueryExpression<TDbType, any, any, any, any, any, any>)[] = [];
        if (!isNullOrUndefined(cb)) {
            const columnsSelection = this.#getColumnsSelection() as TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>;
            const functions = getDbFunctions(this.dbType);
            selectRes = cb(columnsSelection, functions);
        }

        let params: readonly QueryParam<TDbType, any, any, any, any>[] | undefined;
        if (selectRes) {
            params = extractParams(selectRes, this.params);
        } else {
            params = this.params;
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
                this.castType,
                {
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
                        let expression = it[k] as IQueryExpression<TDbType, any, any, any, any, any, any>;
                        finalSelectRes.push(expression);
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
                this.castType,
                {
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
        TJoinTable extends Table<TDbType, any, any> | QueryTable<TDbType, any, any, any, any, any> | QueryBuilder<TDbType, any, any, any, any, any, string, any> | CTEObject<TDbType, any, any, any, any>,
        TCbResult extends ComparisonType<TDbType>,
        TJoinResult extends JoinSpecsTableType<TDbType> =
        TJoinTable extends Table<TDbType, infer TJoinCols, infer TJoinTableName> ?
        QueryTable<
            TDbType,
            TJoinCols,
            TJoinTableName,
            Table<TDbType, TJoinCols, TJoinTableName>,
            MapToQueryColumns<TDbType, TJoinTableName, TJoinCols>
        > :
        TJoinTable extends QueryBuilder<TDbType, any, any, any, any, any, string, any> ? MapToSubQueryObject<TDbType, TJoinTable> :
        TJoinTable extends CTEObject<TDbType, any, any, any, any> ? TJoinTable :
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

        let joinTable: TJoinResult;
        if (table instanceof Table) {
            const queryColumns = table.columnsList.map((col: Column<TDbType, any, any, any, any, any, any>) => {
                return new QueryColumn(table.dbType, col.name, { tableName: table.name, asTableName: undefined }, undefined, undefined);
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
        } else if (table instanceof CTEObject) {
            let ownerName = table.name;
            let selection = columnsSelectionFactory<TDbType>(table, table.cteObjectEntries);

            joinTable = table as CTEObject<TDbType, any, any, any, any> as TJoinResult;

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

        const params = extractParams([comparison, table], this.params);

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
            this.castType,
            {
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

        const params = extractParams([comparison], this.params);

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
            this.castType,
            {
                queryType: this.queryType,
                params: params as AccumulateComparisonParams<TCbResult, TParams>,
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

        const params = extractParams(res, this.params);

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
            this.castType,
            {
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

        const params = extractParams([res], this.params);

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
            this.castType,
            {
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

        let orderByExpressions: IQueryExpression<any, any, any, any, any, any, any>[] = res.reduce((acc, it) => {
            if (Array.isArray(it)) {
                return [...acc, it[0]];
            } else {
                return [...acc, it];
            }
        }, [] as IQueryExpression<any, any, any, any, any, any, any>[]);
        const params = extractParams(orderByExpressions, this.params);

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
            this.castType,
            {
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
            CTEObject<TDbType, any, any, any, any>
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
            CTEObject<TDbType, any, any, any, any>
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
            CTEObject<TDbType, any, any, any, any>
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

        const fromResult = res.map(item => {
            if (item instanceof Table) {
                const queryColumns = item.columnsList.map((col: Column<TDbType, any, any, any, any, any, any>) => {
                    return new QueryColumn(item.dbType, col.name, { tableName: item.name, asTableName: undefined }, undefined, undefined);
                }) as QueryColumn<TDbType, any, any, any, any, any, any>[];

                return new QueryTable(item.dbType, item, queryColumns);
            } if (item instanceof QueryBuilder) {
                return new SubQueryObject(item.dbType, item);
            }
            else {
                return item;
            }
        });

        const params = extractParams(fromResult, this.params);

        return new QueryBuilder<TDbType, any, any, any, any, any, any, any>(
            this.dbType,
            fromResult,
            this.asName,
            this.castType,
            {
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
        TFinalCTE extends CTEObject<TDbType, any, any, any, any> = MapToCTEObjectForRecursive<TDbType, TCTEName, TColumnNames, TAnchorQb>,
        TFinalCTESpecs extends readonly CTEObject<TDbType, any, any, any, any>[] = readonly [...(TCTESpecs extends CTESpecsType<TDbType> ? TCTESpecs : []), TFinalCTE],
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
                let currentExp = selectResult[i];

                finalCTEentries.push(new CTEObjectEntry(anchorQb.dbType, currentExp, undefined, undefined, cteName, currName));
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

        const params = extractParams([finalQb.params], this.params);

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
            this.castType,
            {
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

/**
 * Initialized at moduleInitializer.js to avoid circular dependency issues.
 */
interface QueryBuilder<
    TDbType extends DbType,
    TFrom extends FromType<TDbType> | undefined,
    TJoinSpecs extends JoinSpecsType<TDbType> | undefined,
    TCTESpecs extends CTESpecsType<TDbType> | undefined,
    TResult extends ResultShape<TDbType> | undefined = undefined,
    TParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = undefined,
    TAs extends string | undefined = undefined,
    TCastType extends GetColumnTypes<TDbType> | undefined = undefined
> {

    union: typeof unionFn;
    unionAll: typeof unionAllFn;
    intersect: typeof intersectFn;
    intersectAll: typeof intersectAllFn;
    except: typeof exceptFn;
    exceptAll: typeof exceptAllFn;

    withAs: typeof withAsFnForQb;
    withAsMaterialized: typeof withAsMaterializedFnForQb;
    withAsNotMaterialized: typeof withAsNotMaterializedFnForQb;
}

export default QueryBuilder;

export {
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
    CombineType,
    UNION_TYPE,
    MapQueryResultForCombine,
    CalculateCombineResult,
    CombineSpecsType
}
