import { Link } from 'react-router-dom';

export default function PlacesPage() {
    return (
        <div>
            <div className="text-center">
                <Link className="bg-primary text-white py-2 px-4 rounded-full" to={'/accounts/places/new'}>Add new places</Link>
            </div>
            my places
        </div>
    )
}