// Get HTML elements

const postForm = document.getElementById("postForm");

const postId = document.getElementById("postId");
const title = document.getElementById("title");
const content = document.getElementById("content");
const status = document.getElementById("status");

const postsContainer =
    document.getElementById("postsContainer");

const emptyMessage =
    document.getElementById("emptyMessage");

const filterStatus =
    document.getElementById("filterStatus");

const formTitle =
    document.getElementById("formTitle");

const cancelBtn =
    document.getElementById("cancelBtn");


// Modal elements

const previewModal =
    document.getElementById("previewModal");

const closeModal =
    document.getElementById("closeModal");

const previewTitle =
    document.getElementById("previewTitle");

const previewDate =
    document.getElementById("previewDate");

const previewStatus =
    document.getElementById("previewStatus");

const previewContent =
    document.getElementById("previewContent");


// Get posts from LocalStorage

let posts =
    JSON.parse(localStorage.getItem("blogPosts")) || [];


// Save posts to LocalStorage

function savePosts() {

    localStorage.setItem(
        "blogPosts",
        JSON.stringify(posts)
    );
}


// Generate unique ID

function generateId() {

    return Date.now().toString();
}


// Format date

function formatDate(timestamp) {

    const date = new Date(timestamp);

    return date.toLocaleString();
}


// Display posts

function displayPosts() {

    postsContainer.innerHTML = "";

    const selectedStatus =
        filterStatus.value;


    let filteredPosts = posts;


    // Filter posts

    if (selectedStatus !== "all") {

        filteredPosts =
            posts.filter(
                post => post.status === selectedStatus
            );
    }


    // Empty state

    if (filteredPosts.length === 0) {

        emptyMessage.style.display = "block";

        return;

    } else {

        emptyMessage.style.display = "none";
    }


    // Display each post

    filteredPosts.forEach(post => {

        const card =
            document.createElement("div");

        card.className = "post-card";


        // Short preview

        const shortContent =
            post.content.length > 120
                ? post.content.substring(0, 120) + "..."
                : post.content;


        card.innerHTML = `

            <h3>${escapeHTML(post.title)}</h3>

            <p class="date">
                ${formatDate(post.timestamp)}
            </p>

            <span class="status ${post.status}">
                ${post.status.toUpperCase()}
            </span>

            <p class="post-preview">
                ${escapeHTML(shortContent)}
            </p>

            <div class="card-buttons">

                <button
                    class="view-btn"
                    onclick="viewPost('${post.id}')">
                    View
                </button>

                <button
                    class="edit-btn"
                    onclick="editPost('${post.id}')">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deletePost('${post.id}')">
                    Delete
                </button>

            </div>
        `;


        postsContainer.appendChild(card);

    });

}


// Escape HTML

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// Add / Update post

postForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const postTitle =
            title.value.trim();

        const postContent =
            content.value.trim();

        const postStatus =
            status.value;


        if (!postTitle || !postContent) {

            alert(
                "Please enter title and content."
            );

            return;
        }


        // Update existing post

        if (postId.value) {

            const index =
                posts.findIndex(
                    post => post.id === postId.value
                );


            if (index !== -1) {

                posts[index].title =
                    postTitle;

                posts[index].content =
                    postContent;

                posts[index].status =
                    postStatus;

            }

            alert("Post updated successfully!");

        }

        // Create new post

        else {

            const newPost = {

                id: generateId(),

                title: postTitle,

                content: postContent,

                status: postStatus,

                timestamp: Date.now()

            };


            posts.unshift(newPost);

            alert("Post created successfully!");

        }


        savePosts();

        displayPosts();

        resetForm();

    }
);


// Edit post

function editPost(id) {

    const post =
        posts.find(
            post => post.id === id
        );


    if (!post) return;


    postId.value =
        post.id;

    title.value =
        post.title;

    content.value =
        post.content;

    status.value =
        post.status;


    formTitle.textContent =
        "Edit Post";

    cancelBtn.style.display =
        "inline-block";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// Delete post

function deletePost(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this post?"
        );


    if (!confirmed) return;


    posts =
        posts.filter(
            post => post.id !== id
        );


    savePosts();

    displayPosts();


    alert("Post deleted successfully!");

}


// View post

function viewPost(id) {

    const post =
        posts.find(
            post => post.id === id
        );


    if (!post) return;


    previewTitle.textContent =
        post.title;


    previewDate.textContent =
        formatDate(post.timestamp);


    previewStatus.textContent =
        post.status.toUpperCase();


    previewStatus.className =
        `status ${post.status}`;


    previewContent.textContent =
        post.content;


    previewModal.style.display =
        "flex";

}


// Close modal

closeModal.addEventListener(
    "click",
    function () {

        previewModal.style.display =
            "none";

    }
);


// Close modal when clicking outside

window.addEventListener(
    "click",
    function (event) {

        if (event.target === previewModal) {

            previewModal.style.display =
                "none";

        }

    }
);


// Cancel editing

cancelBtn.addEventListener(
    "click",
    function () {

        resetForm();

    }
);


// Reset form

function resetForm() {

    postForm.reset();

    postId.value = "";

    formTitle.textContent =
        "Create New Post";

    cancelBtn.style.display =
        "none";

}


// Filter posts

filterStatus.addEventListener(
    "change",
    displayPosts
);


// Load posts when page opens

displayPosts();