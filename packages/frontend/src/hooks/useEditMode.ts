import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function useEditMode() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const enterEditMode = useCallback(() => navigate({ search: '?edit=true' }), []);
    const leaveEditMode = useCallback(() => navigate({ search: '' }, { replace: true }), []);

    return {
        isEditMode: searchParams.has('edit'),
        enterEditMode,
        leaveEditMode,
    };
}
