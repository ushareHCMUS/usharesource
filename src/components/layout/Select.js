import React from "react";
import PropTypes from "prop-types";
// eslint-disable-next-line
import { default as ReactSelect } from "react-select";

// specify props.allowSelectAll = true to enable!
const Select = props => {
  if (props.allowSelectAll) {
    if (props.value.length === props.options.length) {
      return (
        <ReactSelect
          {...props}
          value={[props.allOption]}
          onChange={selected => props.onChange(selected.slice(1))}
        />
      );
    }

    return (
      <ReactSelect
        {...props}
        options={[props.allOption, ...props.options]}
        onChange={selected => {
          if (
            selected.length > 0 &&
            selected[selected.length - 1].value === props.allOption.value
          ) {
            return props.onChange(props.options);
          }
          return props.onChange(selected);
        }}
      />
    );
  }

  return <ReactSelect {...props} />;
};

Select.propTypes = {
  options: PropTypes.array,
  value: PropTypes.any,
  onChange: PropTypes.func,
  allowSelectAll: PropTypes.bool,
  allOption: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string
  })
};

Select.defaultProps = {
  allOption: {
    label: "Select all",
    value: "*"
  }
};

export default Select;