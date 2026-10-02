import React from 'react';
import { Html5Audio, Sequence, staticFile } from 'remotion';
import { SFX } from '../timeline';

export const SoundDesign: React.FC = () => (
  <>
    {SFX.map((cue, i) => (
      <Sequence key={`${cue.file}-${cue.frame}-${i}`} from={cue.frame} layout="none" name={`sfx: ${cue.file}`}>
        <Html5Audio src={staticFile(`sfx/${cue.file}.wav`)} volume={cue.volume} />
      </Sequence>
    ))}
  </>
);
