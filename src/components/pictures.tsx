import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { picturesSelector, getSelectedPicture } from '../reducer';
import Modal from './modal';
import * as O from 'fp-ts/lib/Option';

const Container = styled.div`
  padding: 1rem;
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
`;

const Image = styled.img`
  margin: 10px;
  object-fit: contain;
  transition: transform 1s;
  max-width: fit-content;
  &:hover {
    transform: scale(1.2);
  }
`;

const Pictures = () => {
  const pictures = useSelector(picturesSelector);
  const selectedPicture = useSelector(getSelectedPicture);
  const dispatch = useDispatch();

  return (
    <>
      <Container>
        {pictures.map((picture, index) => (
          <Image
            key={index}
            src={picture.previewFormat}
            alt={`Cat by ${picture.author}`}
            onClick={() => dispatch({ type: 'SELECT_PICTURE', picture })}
          />
        ))}
      </Container>

      {O.isSome(selectedPicture) && (
        <Modal
          largeFormat={selectedPicture.value.largeFormat}
          close={() => dispatch({ type: 'CLOSE_MODAL' })}
        />
      )}
    </>
  );
};

export default Pictures;
