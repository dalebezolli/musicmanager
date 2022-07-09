import { decode } from 'he';
import { Link } from 'wouter';
import { useState, useRef, useContext } from 'react';
import ContentViewerProvider, { ContentViewerContext } from './ContentViewerContext';

import { FaSearch, FaTrash } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';

function App() {
  return(
    <ContentViewerProvider>
      <nav className='container mx-auto'>
        <div className='flex justify-between py-3'>
            <Link href='/' className='font-bold hover:text-pink-600'>
              Music Manager
            </Link>
            <SearchBar />
            <UserIcon />
        </div>
        <hr />
      </nav>

      <div className='container mx-auto pt-3'>
        <MusicList /> 
      </div>
    </ContentViewerProvider>
  );
}

function UserIcon() {
  return (
    <div className='w-6 h-6 bg-white rounded-full'></div>
  );
}

function SearchBar() {
  const contentSearchInput = useRef();
  const { searchContent } = useContext(ContentViewerContext);

  const handleKeyUp = (key) => {
    if(key.keyCode !== 13) return;
    const input = contentSearchInput.current.value;
    if(!input) return;

    searchContent(input);
  }

  const handleClick = _ => {
    const input = contentSearchInput.current.value;
    if(!input) return;

    searchContent(input);
  };

  return (
    <div className='h-min'>
      <input 
        type='text' 
        name='content-search' 
        id='content-search' 
        placeholder='Search'
        ref={ contentSearchInput }
        onKeyUp={ handleKeyUp }
        className='bg-black text-white w-[400px] border border-black border-b-white'
      />

      <button 
        className='px-2 hover:text-pink-600' 
        onClick={ handleClick }
      >
        <FaSearch />
      </button>
    </div>
  );
}

function MusicList() {
  const { selectedList } = useContext(ContentViewerContext);

  return(
    <div>
      <h2 className='font-bold text-xl mb-4'>
        Songs 
        <span className='font-normal text-base'>
          &nbsp;- { selectedList.entries.length } songs
        </span>
      </h2>

      <div>
        { 
          selectedList.entries.map(item => {
            // TODO: Once requests go to server, clean this up
            const id = (selectedList.entriesType === 'search' ? item.id.videoId : item.snippet.resourceId.videoId); 
            return <MusicEntry key={ id } resource={ item } resourceOrigin={ selectedList.entriesType } />
          }) 
        }
      </div>
    </div>
  );
}

function MusicEntry({resource, resourceOrigin}) {
  const controls = (resourceOrigin === 'search' ? (
    <FiPlus />
  ) : (
    <FaTrash />
  ) );

  return(
    <div className='w-full p-1 mb-2 border flex justify-between items-center'>
      <div>
        <p>{ decode(resource.snippet.title) }</p>
      </div>

      <div>
        { controls }
      </div>
    </div>
  );
}

export default App;