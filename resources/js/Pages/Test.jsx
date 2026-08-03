import { Head } from '@inertiajs/react';

export default function Test({ message }) {
    return (
        <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
            <Head title="" />
            <h1>🚀 It's Alive!</h1>
            <p>Message from Laravel: <strong>{message}</strong></p>
        </div>
    );
}
