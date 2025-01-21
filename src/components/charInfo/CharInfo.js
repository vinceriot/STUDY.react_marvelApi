import {Component} from 'react';
import './charInfo.scss';
import MarvelService from '../../services/MarvelService';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';


class CharInfo extends Component {

    state = {
        char: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    }


    updateChar = () => {
        const {charId} = this.props;
        if (!charId) {
            return;
        }

        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }
    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false
        })
    }

    onCharLoading = (char) => {
        this.setState({
            loading:true
        })
    
    }
    
    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    render () {
        const {char, loading, error} = this.state;

        const skeleton = char || loading || error ? null : <Skeleton/>;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ? <View char={char}/> : null;
        
        return (
            <div className="char__info">
               {skeleton}
               {errorMessage}
               {spinner}
               {content}
            </div>
        )
    }
}

const ComicsList = ({comics}) => {
    if (comics.length === 0) {
        return <div>Комиксов с этим персонажем нет!</div>;
    }
    
    const newComics = comics.slice(0, 6);


    return (
        <ul className="char__comics-list">
            {newComics.map((item, i) => {
                return (
                    <li key={i} className="char__comics-item">
                        {item.name}
                    </li>
                )
            })}
        </ul>
    )
}

const View = ({char}) => {

    const {name, description, thumbnail, homepage, wiki, comics} = char;
    const image_not_available = thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
    const imgStyle = image_not_available ? {objectFit: 'contain'} : {objectFit: 'cover'};
    const comicsList = <ComicsList comics={comics}/>
    return (
        <>
         <div className="char__basics">
                    <img src={thumbnail} alt={name} style={imgStyle}/>
                    <div>
                        <div className="char__info-name">{name}</div>
                        <div className="char__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="char__descr">
                    {description}
                </div>
                <div className="char__comics">Comics:</div>
                {comicsList}
        </>
    )

}

export default CharInfo;