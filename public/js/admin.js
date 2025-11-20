async function changeRole(userId, newRole) {
    try {
        const response = await fetch(`/panel-a8f5e9c2b7/users/${userId}/role`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error changing role:', error);
        return { success: false, message: 'Network error' };
    }
}

async function toggleBan(userId, shouldBan) {
    if (typeof shouldBan === 'string') {
        shouldBan = shouldBan === 'true';
    }

    const action = shouldBan ? 'ban' : 'unban';

    if (!confirm(`Are you sure you want to ${action} this user?`)) {
        return null;
    }

    try {
        const response = await fetch(`/panel-a8f5e9c2b7/users/${userId}/ban`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ banned: shouldBan.toString() })
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            location.reload();
        } else {
            alert('Error: ' + data.message);
        }

        return data;
    } catch (error) {
        console.error('Error toggling ban:', error);
        alert('Error updating ban status');
        return { success: false, message: 'Network error' };
    }
}

async function deleteUser(userId, username) {
    if (!confirm(`Are you sure you want to delete ${username}? This will also delete all their pastes. This action cannot be undone!`)) {
        return null;
    }

    if (!confirm('Are you REALLY sure? Type YES in the next prompt to confirm.')) {
        return null;
    }

    const confirmation = prompt('Type YES to confirm deletion:');
    if (confirmation !== 'YES') {
        alert('Deletion cancelled');
        return null;
    }

    try {
        const response = await fetch(`/panel-a8f5e9c2b7/users/${userId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            location.reload();
        } else {
            alert('Error: ' + data.message);
        }

        return data;
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
        return { success: false, message: 'Network error' };
    }
}

async function deletePaste(shortId, title) {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone!`)) {
        return null;
    }

    try {
        const response = await fetch(`/panel-a8f5e9c2b7/pastes/${shortId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            location.reload();
        } else {
            alert('Error: ' + data.message);
        }

        return data;
    } catch (error) {
        console.error('Error deleting paste:', error);
        alert('Error deleting paste');
        return { success: false, message: 'Network error' };
    }
}

function initializeRoleSelects() {
    document.querySelectorAll('.role-select').forEach(select => {
        select.addEventListener('change', async (e) => {
            const userId = e.target.dataset.userId;
            const newRole = e.target.value;
            const originalValue = e.target.dataset.originalValue || 'user';

            if (!confirm(`Change user role to ${newRole}?`)) {
                e.target.value = originalValue;
                return;
            }

            const result = await changeRole(userId, newRole);

            if (result.success) {
                alert('Role updated successfully');
                location.reload();
            } else {
                alert('Error: ' + result.message);
                e.target.value = originalValue;
            }
        });

        select.dataset.originalValue = select.value;
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRoleSelects);
} else {
    initializeRoleSelects();
}