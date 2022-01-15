type File = {
  id: string;
  name: string;
};

type Folder = {
  id: string;
  name: string;
  files: File[];
};

type Found = {
  source: {
    value?: Folder | File | undefined;
    folder?: Folder;
  };
  destination: {
    value?: Folder | File | undefined;
    folder?: Folder;
  };
};

// Please update this type as same as with the data shape.
type List = Folder[];

export function findInList(list: List, sourceId: string, destinationId: string): Found {
  let source: Folder | File | undefined;
  let destination: Folder | File | undefined;
  let folderOfSourceFile: Folder | undefined;
  let folderOfDestinationFile: Folder | undefined;

  list.forEach((folder) => {
    const { files } = folder;

    if (folder.id === sourceId) {
      source = folder;
    } else if (folder.id === destinationId) {
      destination = folder;
    }

    files.forEach((file) => {
      if (file.id === sourceId) {
        source = file;
        folderOfSourceFile = folder;
      } else if (file.id === destinationId) {
        destination = file;
        folderOfDestinationFile = folder;
      }
    });
  });

  return {
    source: {
      value: source,
      folder: folderOfSourceFile,
    },
    destination: {
      value: destination,
      folder: folderOfDestinationFile,
    },
  };
}

export default function move(list: List, sourceId: string, destinationId: string): List {
  const found = findInList(list, sourceId, destinationId);
  const { source, destination } = found;
  const sourceValue = source?.value;
  const destinationValue = destination?.value;

  if (!sourceValue) {
    throw Error('Source not found');
  }

  if (!destinationValue) {
    throw Error('Destination not found');
  }

  if ('files' in sourceValue) {
    throw Error('You cannot move a folder');
  }

  if (!('files' in destinationValue)) {
    throw Error('You cannot specify a file as the destination');
  }

  const sourceFolder = source?.folder;
  const destinationFolder = destinationValue;

  if (!sourceFolder) {
    throw Error('Source folder not found');
  }

  // removes file from source folder
  sourceFolder.files = sourceFolder.files.filter((file: File) => file.id !== sourceValue.id);

  // pushed source file to new folder
  destinationFolder.files.push(sourceValue);

  // sets source folder and destination folders to new list
  const newList: List = list.map((folder) => {
    let newFolder = folder;
    if (folder.id === sourceFolder.id) {
      newFolder = sourceFolder;
    } else if (folder.id === destinationFolder.id) {
      newFolder = destinationFolder;
    }
    return newFolder;
  });

  return newList;
}
