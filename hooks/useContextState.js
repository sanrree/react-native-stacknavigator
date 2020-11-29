import { useState } from 'react';

export default function useContextState() {
  const [value, setValues] = useState({});

  function setValue(newValue) {
    setValues({ ...value, newValue });
  }

  return {
    values: value,
    setValue,
  };
}
