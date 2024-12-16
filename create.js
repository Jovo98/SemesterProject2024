document.getElementById('createBtn').addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('createModal'));
    modal.show();
});

document.getElementById('createForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const tagsInput = document.getElementById('tags').value.trim();
    const mediaInput = document.getElementById('media').value.trim();
    const endsAt = document.getElementById('endsAt').value;


    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()) : [];


    const media = mediaInput
        ? mediaInput.split(',').map(url => ({ url: url.trim() }))
        : [];

    const payload = {
        title,
        description,
        tags,
        media,
        endsAt,
    };

    try {
        const response = await fetch('https://v2.api.noroff.dev/auction/listings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                "X-Noroff-API-Key": 'afad05b1-e389-4ab8-a92d-d77313b4da24',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Server Response:', result);
            alert('Listing created successfully!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('createModal'));
            modal.hide();
        } else {
            const error = await response.json();
            alert('Failed to create listing: ' + (error.errors[0]?.message || 'Unknown error'));
        }
    } catch (err) {
        alert('An error occurred while creating the listing.');
    }
});
