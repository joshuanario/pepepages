import React from 'react'

type State = {
    isMounting: boolean,
    isAnimating: boolean,
    text: string
}

type Props = {
    firstText: string,
    secondText: string,
    mountingClass: string,
    animatingClass: string
}

export default class Dichotomy extends React.Component<Props, State> {
    constructor(props: Props){
        super(props)
        this.state = {
            isMounting: true,
            isAnimating: false,
            text: props.firstText
        }
        this.onEnter = this.onEnter.bind(this)
        this.onTouch = this.onTouch.bind(this)
    }

    componentDidMount () {
        this.setState(
            {
                isMounting: true,
            },
            () => {
                setTimeout(
                    () => {
                        this.setState({
                            isMounting: false
                        })
                    },
                    3000
                )
            }
        )
    }

    animateAndToggle(content: string | null) {
        this.setState(
            {
                isAnimating: true,
                text: content === this.props.firstText ? this.props.secondText : this.props.firstText
            },
            () => {
                setTimeout(
                    () => {
                        this.setState({
                            isAnimating: false
                        })
                    },
                    10000
                )
            }
        )
    }

    onEnter(e: React.MouseEvent) {
        e.preventDefault();
        this.animateAndToggle(e.currentTarget.textContent);
    }

    onTouch(e: React.TouchEvent) {
        e.preventDefault();
        this.animateAndToggle(e.currentTarget.textContent);
    }

    render() {
        const className = this.state.isMounting ? this.props.mountingClass : this.state.isAnimating ? this.props.animatingClass : ""

        return (
            <span className={className} onMouseEnter={this.onEnter} onTouchEnd={this.onTouch}>{this.state.text}</span>
        )
    }
}
  