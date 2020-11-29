import { useContext } from 'react';
import StackContext from '../context';

function useController() {
  const navigatorControlls = useContext(StackContext);

  return navigatorControlls;
}

export default useController;
