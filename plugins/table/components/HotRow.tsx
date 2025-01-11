import React, { forwardRef, useEffect, useCallback, useImperativeHandle } from 'react';
import Handsontable from 'handsontable';

type ValidatorCallback = (isValid: boolean) => void;
type ValidatorFunction = (value: any[], callback: ValidatorCallback) => void;

interface HotRowProps {
  height?: number;
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
  hidden?: boolean;
  nested?: boolean;
  collapsible?: boolean;
  expanded?: boolean;
  renderer?: (
    instance: Handsontable, 
    TD: HTMLTableCellElement, 
    row: number, 
    col: number, 
    prop: string | number, 
    value: any, 
    cellProperties: Handsontable.CellProperties
  ) => void;
  parentId?: number | string;
  level?: number;
  isChild?: boolean;
  validator?: ValidatorFunction;
  onAfterValidate?: (isValid: boolean, value: any[], row: number) => void;
  onBeforeRowMove?: (row: number, target: number) => void;
  onAfterRowMove?: (row: number, target: number) => void;
  onRowExpand?: (row: number) => void;
  onRowCollapse?: (row: number) => void;
  _rowIndex?: number;
  _emitRowSettings?: (rowSettings: Handsontable.CellProperties & RowSettings, rowIndex: number) => void;
  children?: React.ReactNode;
  onValidationError?: (error: Error) => void;
}

type RowSettings = Partial<Handsontable.CellProperties> & {
  height?: number;
  readOnly?: boolean;
  className?: string;
  hidden?: boolean;
  nested?: boolean;
  collapsible?: boolean;
  expanded?: boolean;
  renderer?: (
    instance: Handsontable, 
    TD: HTMLTableCellElement,
    row: number, 
    col: number, 
    prop: string | number, 
    value: any, 
    cellProperties: Handsontable.CellProperties
  ) => void;
  validator?: (value: any[], callback: (valid: boolean) => void) => void;
}

const defaultProps = {
  readOnly: false,
  hidden: false,
  nested: false,
  collapsible: false,
  expanded: true,
  level: 0,
  isChild: false
} as const;

type DefaultProps = typeof defaultProps;
type RequiredProps = Required<Pick<HotRowProps, keyof DefaultProps>>;
type Props = Omit<HotRowProps, keyof DefaultProps> & Partial<RequiredProps>;

/**
 * HotRow bileşeni, Handsontable için özelleştirilebilir satır yapılandırması sağlar.
 * @component
 * @example
 * ```tsx
 * <HotRow
 *   height={40}
 *   readOnly={false}
 *   validator={(value, callback) => {
 *     callback(value.length > 0);
 *   }}
 *   onAfterValidate={(isValid, value, row) => {
 *     console.log(`Row ${row} validation: ${isValid}`);
 *   }}
 * >
 *   {children}
 * </HotRow>
 * ```
 */
const HotRow = forwardRef<Handsontable.CellProperties, Props>((props, ref) => {
  const finalProps = { ...defaultProps, ...props } as RequiredProps & Props;
  const {
    height,
    readOnly = false,
    className,
    hidden = false,
    nested = false,
    collapsible = false,
    expanded = true,
    renderer,
    parentId,
    level = 0,
    isChild = false,
    validator,
    onAfterValidate,
    onBeforeRowMove,
    onAfterRowMove,
    onRowExpand,
    onRowCollapse,
    children,
    _rowIndex,
    _emitRowSettings,
    onValidationError
  } = finalProps;

  const createRowSettings = useCallback((): RowSettings => {
    try {
      return {
        height,
        readOnly,
        className,
        hidden,
        nested,
        collapsible,
        expanded,
        renderer,
        validator: validator ? (value: any[], callback: ValidatorCallback) => {
          try {
            validator(value, (isValid) => {
              callback(isValid);
              if (typeof _rowIndex === 'number') {
                onAfterValidate?.(isValid, value, _rowIndex);
              }
            });
          } catch (error) {
            console.error('Validation error:', error);
            onValidationError?.(error as Error);
            callback(false);
          }
        } : undefined,
        ...(nested && collapsible ? {
          parent: parentId,
          level,
          isChild
        } : {})
      };
    } catch (error) {
      console.error('Row settings error:', error);
      return {};
    }
  }, [
    height, readOnly, className, hidden, nested, collapsible, 
    expanded, renderer, validator, parentId, level, isChild, 
    _rowIndex, onAfterValidate, onBeforeRowMove, onAfterRowMove,
    onRowExpand, onRowCollapse, onValidationError
  ]);

  const rowEventHandlers = useCallback(() => ({
    beforeRowMove: onBeforeRowMove,
    afterRowMove: onAfterRowMove,
    afterRowExpand: onRowExpand,
    afterRowCollapse: onRowCollapse
  }), [onBeforeRowMove, onAfterRowMove, onRowExpand, onRowCollapse]);

  const getCellSettings = useCallback(() => {
    const settings = createRowSettings();
    const handlers = rowEventHandlers();
    
    return React.useMemo(() => {
      const { beforeRowMove, afterRowMove, afterRowExpand, afterRowCollapse, ...cellSettings } = {
        ...settings,
        ...handlers
      };
      return cellSettings as Handsontable.CellProperties & RowSettings;
    }, [settings, handlers]);
  }, [createRowSettings, rowEventHandlers]);

  useImperativeHandle(ref, getCellSettings, [getCellSettings]);

  useEffect(() => {
    let isSubscribed = true;
    
    if (_emitRowSettings && typeof _rowIndex === 'number') {
      const cellSettings = getCellSettings();
      if (isSubscribed) {
        _emitRowSettings(cellSettings, _rowIndex);
      }
    }
    
    return () => {
      isSubscribed = false;
    };
  }, [_emitRowSettings, _rowIndex, getCellSettings]);

  return <>{children}</>;
});

HotRow.displayName = "HotRow";

export { HotRow };
export type { HotRowProps, RowSettings };