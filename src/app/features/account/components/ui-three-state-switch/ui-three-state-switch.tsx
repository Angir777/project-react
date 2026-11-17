import { cn } from '@/shadcn/lib/utils';

interface UiThreeStateSwitchProps {
  size?: 'small' | 'medium' | 'large';
  /** null -> true -> false -> null */
  value: boolean | null;
  onChange: (value: boolean | null) => void;
}

const sizeClasses = {
  small: {
    track: 'w-[50px] h-5 rounded-[20px]',
    knob: 'size-[21px]',
    middle: 'left-[calc(50%-10px)]',
    right: 'left-[calc(100%-20px)]',
  },
  medium: {
    track: 'w-[70px] h-[30px] rounded-[30px]',
    knob: 'size-[30px]',
    middle: 'left-[calc(50%-15px)]',
    right: 'left-[calc(100%-30px)]',
  },
  large: {
    track: 'w-[100px] h-10 rounded-[40px]',
    knob: 'size-10',
    middle: 'left-[calc(50%-20px)]',
    right: 'left-[calc(100%-40px)]',
  },
};

/**
 * Three-state switch (null / true / false). Not used by any view – kept for parity with Angular.
 */
export function UiThreeStateSwitch({ size = 'medium', value, onChange }: UiThreeStateSwitchProps) {
  const classes = sizeClasses[size];

  const onSettingChange = () => {
    if (value === null) {
      onChange(true); // Switch to true
    } else if (value === true) {
      onChange(false); // Switch to false
    } else {
      onChange(null); // Switch to null
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value === null ? 'mixed' : value}
      onClick={onSettingChange}
      className={cn(
        'relative inline-block box-content cursor-pointer border border-[#dfdfdf] transition-colors duration-300',
        classes.track,
        value === null ? 'bg-[#f0f0f0]' : 'bg-[rgb(100,189,99)]',
      )}
    >
      <div
        className={cn(
          'absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.4)] transition-[left,background-color] duration-300',
          classes.knob,
          value === false && 'left-0',
          value === null && classes.middle,
          value === true && classes.right,
        )}
      ></div>
    </button>
  );
}
