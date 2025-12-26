import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="not-found">
            <div className="not-found-code">404</div>
            <h2>הדף שחיפשת לא קיים</h2>
            <p>נראה שהגעת לכתובת שגויה או שהדף הוסר מהמערכת.</p>
            <Link to="/dashboard">
                <button className="btn btn-primary btn-lg">
                    חזרה לדף הבית
                </button>
            </Link>
        </div>
    );
};

export default NotFound;