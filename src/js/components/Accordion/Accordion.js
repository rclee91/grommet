import React, { Children, forwardRef, useState } from 'react';
import { AccordionPropTypes } from './propTypes';
import { Box } from '../Box';

import { AccordionContext } from './AccordionContext';

const activeAsArray = (active) =>
  typeof active === 'number' ? [active] : active;

const Accordion = forwardRef(
  (
    { activeIndex, animate = true, children, multiple, onActive, ...rest },
    ref,
  ) => {
    const [activeIndexes, setActiveIndexes] = useState([]);
    const [stateActiveIndex, setStateActiveIndex] = useState();

    // Derived state from props
    // https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops
    const derivedActiveIndexes = activeAsArray(activeIndex) || [];
    if (
      (typeof activeIndex !== 'undefined' ||
        activeIndex !== stateActiveIndex) &&
      derivedActiveIndexes.join() !== activeIndexes.join()
    ) {
      setActiveIndexes(derivedActiveIndexes);
      setStateActiveIndex(activeIndex);
    }

    const onPanelChange = (index) => {
      let nextActiveIndexes = [...(activeIndexes || [])];

      const nextActiveIndex = nextActiveIndexes.indexOf(index);
      if (nextActiveIndex > -1) {
        nextActiveIndexes.splice(nextActiveIndex, 1);
      } else if (multiple) {
        nextActiveIndexes.push(index);
      } else {
        nextActiveIndexes = [index];
      }

      setActiveIndexes(nextActiveIndexes);
      if (onActive) {
        onActive(nextActiveIndexes);
      }
    };

    return (
      <Box ref={ref} role="tablist" {...rest}>
        {Children.toArray(children)
          .filter((child) => child)
          .map((child, index) => (
            <AccordionContext.Provider
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              value={{
                active: activeIndexes.indexOf(index) > -1,
                animate,
                onPanelChange: () => onPanelChange(index),
              }}
            >
              {child}
            </AccordionContext.Provider>
          ))}
      </Box>
    );
  },
);

Accordion.propTypes = AccordionPropTypes;

export { Accordion };
