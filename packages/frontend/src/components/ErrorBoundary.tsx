import React from 'react';
/* global umami */

interface ErrorBoundaryProps {
    onError?: () => void;
}
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean }> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        // Display fallback UI
        if (process.env.NODE_ENV === 'production') {
            this.setState({ hasError: true });
            console.log('error', error, info);
            // @ts-ignore
            umami.trackEvent(JSON.stringify(info), error.message);
        }
    }

    render() {
        if (this.state.hasError) {
            // if (this.props.onError)

            // You can render any custom fallback UI
            return (
                <div>
                    <h1>Nastala chyba při vytváření rozhraní.</h1>
                    <a style={{ color: 'blue' }} href="#" onClick={() => document.location.reload(true)}>
                        Kliknutím na tento odkaz rozhraní restartujete
                    </a>
                    <br />
                    <br />
                    {this.props.onError && (
                        <a href="#" style={{ color: 'red' }} onClick={this.props.onError}>
                            Pokud restart nepomohl, tímto odkazem se provede pokročilejší akce
                        </a>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
