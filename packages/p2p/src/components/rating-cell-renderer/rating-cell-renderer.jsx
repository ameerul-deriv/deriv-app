import React from 'react';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import UserRatingButton from 'Components/user-rating-button';
import StarRating from 'Components/star-rating';

const RatingCellRenderer = ({ is_reviewable, rating, review_details }) => {
    return review_details ? (
        <div className='rating-cell-renderer'>
            <StarRating
                empty_star_className='rating-cell-renderer--star'
                empty_star_icon='IcEmptyStar'
                full_star_className='rating-cell-renderer--star'
                full_star_icon='IcFullStar'
                initial_value={rating}
                is_readonly
                number_of_stars={5}
                should_allow_hover_effect={false}
                star_size={11}
            />
        </div>
    ) : (
        <UserRatingButton has_full_text={false} is_disabled={is_reviewable} />
    );
};

RatingCellRenderer.propTypes = {
    is_reviewable: PropTypes.bool,
    rating: PropTypes.number,
    review_details: PropTypes.object,
};

export default observer(RatingCellRenderer);
