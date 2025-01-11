import React, { forwardRef, useEffect, useRef, useMemo, memo, useCallback } from 'react';
import Handsontable from 'handsontable';
import { createRoot } from 'react-dom/client';

// Column Props Interface
interface HotColumnProps<T = any> extends Omit<Handsontable.ColumnSettings, 'onChange'> {
  data?: keyof T & (string | number);
  value?: T[keyof T];
  onChange?: (value: T[keyof T], oldValue: T[keyof T]) => void;
  title?: string;
  type?: 'text' | 'numeric' | 'date' | 'checkbox' | 'select' | 'dropdown' | 'autocomplete';
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
  
  renderer?: (instance: Handsontable, TD: HTMLTableCellElement, row: number, col: number, prop: string | number, value: any, cellProperties: Handsontable.CellProperties) => void;
  editor?: typeof Handsontable.editors.BaseEditor;
  
  validator?: (value: any, callback: (valid: boolean) => void) => void;
  allowInvalid?: boolean;
  
  format?: string;
  width?: number;
  wordWrap?: boolean;
  
  source?: any[];
  strict?: boolean;
  
  onAfterValidate?: (isValid: boolean, value: any, row: number, prop: string | number) => void;
  onValidationError?: (error: Error) => void;
  
  _componentRendererColumns?: Map<number | string, boolean>;
  _emitColumnSettings?: (columnSettings: Handsontable.ColumnSettings, columnIndex: number) => void;
  _columnIndex?: number;
  _getEditorCache?: () => Map<Function, Map<string | number, React.Component>>;
  _getOwnerDocument?: () => Document;
  
  children?: React.ReactNode;
  group?: string;
  groupOrder?: number;
  
  validationRules?: ValidationRule[];
}

interface ColumnRef {
  current: Handsontable.ColumnSettings | null;
}

interface EditorElementProps {
  editorCache?: Map<Function, Map<string | number, React.Component>>;
  columnIndex?: number;
  value?: any;
  onChange?: (newValue: EditorValue) => void;
  isOpen?: boolean;
}

interface EditorValue<T = unknown> {
  value: T;
  isValid?: boolean;
  metadata?: Record<string, unknown>;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  isDirty: boolean;
}

type ValidatorFunction<T = any> = (
  value: T,
  callback: (valid: boolean) => void
) => void | Promise<void>;

interface ValidationOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

const defaultValidationOptions: ValidationOptions = {
  timeout: 5000,
  retries: 2,
  retryDelay: 1000
};

export const validateWithRetry = async (
  validator: ValidatorFunction,
  value: any,
  options: ValidationOptions = defaultValidationOptions
): Promise<boolean> => {
  let attempts = 0;
  
  while (attempts <= (options.retries || 0)) {
    try {
      return await new Promise<boolean>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Doğrulama zaman aşımı'));
        }, options.timeout);

        validator(value, (isValid: boolean) => {
          clearTimeout(timeoutId);
          resolve(isValid);
        });
      });
    } catch (error) {
      attempts++;
      if (attempts > (options.retries || 0)) throw error;
      await new Promise(resolve => setTimeout(resolve, options.retryDelay));
    }
  }
  return false;
};

export type { ValidatorFunction };

const getExtendedEditorElement = (
  children: React.ReactNode,
  editorCache?: Map<Function, Map<string | number, React.Component>>,
  columnIndex?: number
): React.ReactElement<EditorElementProps> | null => {
  if (!React.isValidElement(children)) {
    return null;
  }
  
  return React.cloneElement(children as React.ReactElement<EditorElementProps>, {
    editorCache,
    columnIndex
  });
};

const useEditorPortal = (ownerDocument: Document, element: React.ReactElement | null) => {
  const cleanup = useRef<(() => void) | null>(null);
  
  useEffect(() => {
    if (!element) return;
    
    const container = ownerDocument.createElement('div');
    const root = createRoot(container);
    
    cleanup.current = () => {
      try {
        root.unmount();
        container.remove();
      } catch (error) {
        console.error('Portal temizleme hatası:', error);
      }
    };
    
    ownerDocument.body.appendChild(container);
    root.render(element);
    
    return () => cleanup.current?.();
  }, [ownerDocument, element]);
};

class HotColumnErrorBoundary extends React.Component<{
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}> {
  state = { hasError: false, error: null as Error | null };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('HotColumn hatası:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="hot-column-error">
          <p>Kolon yüklenirken hata oluştu.</p>
          <small>{this.state.error?.message}</small>
        </div>
      );
    }
    return this.props.children;
  }
}

class ValidationError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'ValidationError';
  }
}

const handleValidationError = (error: Error, onValidationError?: (error: Error) => void) => {
  if (error instanceof ValidationError) {
    console.error('Doğrulama hatası:', error.message, error.details);
  } else {
    console.error('Beklenmeyen hata:', error);
  }
  onValidationError?.(error);
};

const HotColumn = memo(forwardRef<ColumnRef, HotColumnProps>((props, ref) => {
  const {
    data,
    title,
    type = 'text',
    readOnly = false,
    className,
    style,
    renderer,
    editor,
    validator,
    allowInvalid = true,
    format,
    width,
    wordWrap = true,
    source,
    strict = true,
    onChange,
    onAfterValidate,
    onValidationError,
    children,
    _componentRendererColumns,
    _emitColumnSettings,
    _columnIndex,
    _getEditorCache,
    _getOwnerDocument,
    group,
    groupOrder,
    validationRules,
    ...restProps
  } = props;

  const columnRef = useRef<ColumnRef>({ current: null });

  const internalProps = ['_componentRendererColumns', '_emitColumnSettings', '_columnIndex', '_getEditorCache', '_getOwnerDocument', 'children'];

  const filteredProps = Object.fromEntries(
    Object.entries({ ...props, ...restProps }).filter(([key]) => !internalProps.includes(key))
  );

  const memoizedValidator = useCallback((value: any, callback: (valid: boolean) => void) => {
    try {
      const timeoutPromise = new Promise<void>((_, reject) => {
        setTimeout(() => reject(new Error('Doğrulama zaman aşımı')), 5000);
      });

      const validationPromise = new Promise<void>((resolve) => {
        validator(value, (isValid: boolean) => {
          callback(isValid);
          onAfterValidate?.(isValid, value, _columnIndex, data);
          resolve();
        });
      });

      return Promise.race([timeoutPromise, validationPromise]);
    } catch (error) {
      handleValidationError(error as Error, props.onValidationError);
      callback(false);
    }
  }, [validator, onAfterValidate, _columnIndex, data, props.onValidationError]);

  const memoizedColumnSettings = useMemo(() => ({
    data,
    title,
    type,
    readOnly,
    className,
    renderer: renderer || undefined,
    editor: editor || undefined,
    validator: memoizedValidator,
    allowInvalid,
    format,
    width,
    wordWrap,
    source,
    strict,
    ...filteredProps
  }), [
    data,
    title,
    type,
    readOnly,
    className,
    renderer,
    editor,
    memoizedValidator,
    allowInvalid,
    format,
    width,
    wordWrap,
    source,
    strict,
    filteredProps
  ]);

  const columnSettings = useMemo(() => memoizedColumnSettings, [memoizedColumnSettings]);

  useEffect(() => {
    columnRef.current.current = columnSettings;
  }, [columnSettings]);

  useEffect(() => {
    if (ref && 'current' in ref) {
      ref.current = { current: columnSettings };
    }
  }, [columnSettings, ref]);

  const renderEditorPortal = (): React.ReactNode => {
    const ownerDocument = _getOwnerDocument?.();
    if (!ownerDocument || !children) return null;

    useEditorPortal(
      ownerDocument,
      getExtendedEditorElement(children, _getEditorCache?.(), _columnIndex)
    );
    
    return null;
  };

  const editorCache = useRef(new Map<string, React.Component>());

  useEffect(() => {
    return () => {
      editorCache.current.clear();
    };
  }, []);

  return (
    <React.Fragment>
      {renderEditorPortal()}
    </React.Fragment>
  );
}));

const EnhancedHotColumn: React.FC<HotColumnProps> = (props) => {
  return (
    <HotColumnErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Kolon hatası:', error, errorInfo);
      }}
    >
      <HotColumn
        {...props}
        aria-label={props.title}
        data-testid={`hot-column-${props.data}`}
        role="gridcell"
        aria-readonly={props.readOnly}
        aria-invalid={props.validator ? undefined : false}
      />
    </HotColumnErrorBoundary>
  );
};

export default EnhancedHotColumn;
export type { HotColumnProps, EditorValue, ValidationResult };

interface ValidationRule<T = any> {
  type: 'required' | 'regex' | 'custom' | 'range';
  message: string;
  validator?: ValidatorFunction<T>;
  pattern?: RegExp;
  min?: number;
  max?: number;
}

export const validateValue = async <T,>(
  value: T,
  rules: ValidationRule<T>[],
  options: ValidationOptions
): Promise<ValidationResult> => {
  const errors: string[] = [];
  let isValid = true;

  for (const rule of rules) {
    try {
      const ruleValid = await validateWithRetry(
        rule.validator || defaultValidators[rule.type],
        value,
        options
      );
      
      if (!ruleValid) {
        errors.push(rule.message);
        isValid = false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      errors.push(errorMessage);
      isValid = false;
    }
  }

  return {
    isValid,
    errors,
    isDirty: true
  };
};

const defaultValidators: Record<ValidationRule['type'], ValidatorFunction<any>> = {
  required: (value, callback) => callback(!!value),
  regex: (_value, callback) => callback(true),
  custom: (_value, callback) => callback(true),
  range: (_value, callback) => callback(true)
};