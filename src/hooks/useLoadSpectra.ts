/* eslint-disable @typescript-eslint/no-explicit-any */
// import { addBruker, addJcamp, addJDF } from 'nmrium/lib/data/SpectraManager';
import { useCallback, useMemo, useState } from 'react';
import { read } from 'nmr-load-save';
import { Spectrum } from 'nmr-load-save/lib/types/Spectra/Spectrum';
import events from '../events';
import { isArrayOfString } from '../utilities/isArrayOfString';
import { loadFilesFromURLs } from '../utilities/loadFilesFromURLs';

export function useLoadSpectra() {
  const [data, setData] = useState<{
    spectra: Spectrum[];
    molecules: Record<string, string>[];
  }>({ spectra: [], molecules: [] });
  const [isLoading, setLoading] = useState<boolean>(false);

  const load = useCallback(
    async (options: { urls: string[] } | { files: File[] }) => {
      setLoading(true);
      try {
        let inputFiles: File[] = [];

        if ('urls' in options) {
          if (isArrayOfString(options.urls)) {
            inputFiles = await loadFilesFromURLs(options.urls);
          } else {
            throw new Error('The input must be string[] ');
          }
        } else if ('files' in options) {
          inputFiles = options.files;
        }

        const { spectra, molecules } = await read(inputFiles);
        setData({ spectra, molecules });
      } catch (error: any) {
        events.trigger('error', error);
        // eslint-disable-next-line no-console
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return useMemo(
    () => ({
      data,
      load,
      isLoading,
    }),
    [data, isLoading, load],
  );
}
