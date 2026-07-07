"""Deploy Service - Deploy generated HTML to Netlify or GitHub Pages."""
import json
import requests
import base64
import hashlib


def deploy_to_netlify(html_content: str) -> str:
    """Deploy HTML to Netlify using their API (anonymous deploy).
    
    Uses Netlify's Deploy API to create a site without requiring user auth.
    Returns the deployed site URL.
    """
    # Calculate file hash for deduplication
    file_hash = hashlib.sha1(html_content.encode("utf-8")).hexdigest()
    
    # Prepare deploy payload
    payload = {
        "files": {"/index.html": file_hash},
    }
    
    # Create site
    headers = {"Content-Type": "application/json"}
    resp = requests.post(
        "https://api.netlify.com/api/v1/sites",
        headers=headers,
        json=payload,
        timeout=30,
    )
    
    if resp.status_code not in (200, 201):
        raise ValueError(f"Netlify API error: {resp.status_code} - {resp.text[:200]}")
    
    site_data = resp.json()
    deploy_id = site_data.get("deploy_id") or site_data.get("id")
    site_url = site_data.get("ssl_url") or site_data.get("url", "")
    
    # Upload the file
    upload_headers = {
        "Content-Type": "application/octet-stream",
    }
    upload_resp = requests.put(
        f"https://api.netlify.com/api/v1/deploys/{deploy_id}/files/index.html",
        headers=upload_headers,
        data=html_content.encode("utf-8"),
        timeout=30,
    )
    
    if upload_resp.status_code not in (200, 201):
        raise ValueError(f"Netlify upload error: {upload_resp.status_code}")
    
    # Ensure URL has scheme
    if site_url and not site_url.startswith("http"):
        site_url = f"https://{site_url}"
    
    return site_url


def deploy_to_github_pages(html_content: str, github_token: str, repo_name: str = "my-resume-site") -> str:
    """Deploy HTML to GitHub Pages.
    
    Creates a repo (if not exists) and pushes index.html to gh-pages branch.
    Returns the GitHub Pages URL.
    """
    if not github_token:
        raise ValueError("GitHub token is required for GitHub Pages deployment")
    
    headers = {
        "Authorization": f"token {github_token}",
        "Accept": "application/vnd.github.v3+json",
    }
    
    # Get authenticated user info
    user_resp = requests.get("https://api.github.com/user", headers=headers, timeout=10)
    if user_resp.status_code != 200:
        raise ValueError(f"GitHub auth failed: {user_resp.status_code}")
    username = user_resp.json().get("login", "")
    
    # Check if repo exists, create if not
    repo_resp = requests.get(
        f"https://api.github.com/repos/{username}/{repo_name}",
        headers=headers, timeout=10,
    )
    
    if repo_resp.status_code == 404:
        # Create repo
        create_resp = requests.post(
            "https://api.github.com/user/repos",
            headers=headers,
            json={"name": repo_name, "description": "My personal resume website", "public": True, "auto_init": True},
            timeout=15,
        )
        if create_resp.status_code not in (200, 201):
            raise ValueError(f"Failed to create repo: {create_resp.text[:200]}")
    
    # Encode content as base64
    content_b64 = base64.b64encode(html_content.encode("utf-8")).decode("utf-8")
    
    # Check if file exists to get SHA (for update)
    file_resp = requests.get(
        f"https://api.github.com/repos/{username}/{repo_name}/contents/index.html",
        headers=headers,
        params={"ref": "main"},
        timeout=10,
    )
    
    body = {
        "message": "Deploy resume website",
        "content": content_b64,
        "branch": "main",
    }
    
    if file_resp.status_code == 200:
        body["sha"] = file_resp.json().get("sha", "")
    
    # Create/update index.html
    put_resp = requests.put(
        f"https://api.github.com/repos/{username}/{repo_name}/contents/index.html",
        headers=headers,
        json=body,
        timeout=30,
    )
    
    if put_resp.status_code not in (200, 201):
        raise ValueError(f"Failed to push file: {put_resp.text[:200]}")
    
    # Enable GitHub Pages
    pages_resp = requests.post(
        f"https://api.github.com/repos/{username}/{repo_name}/pages",
        headers=headers,
        json={"source": {"branch": "main", "path": "/"}},
        timeout=10,
    )
    # Pages might already be enabled, that's OK
    
    # Return the Pages URL
    pages_url = f"https://{username}.github.io/{repo_name}"
    return pages_url
