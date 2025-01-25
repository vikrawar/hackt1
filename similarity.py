def similar(query="What is the zoning district and permissible use for this address?"):
    import os
    import faiss
    import numpy as np
    from sentence_transformers import SentenceTransformer
    
    # Path to the folder containing .txt files
    folder_path = 'pdfs'
    
    # Read all .txt files and store the content
    file_contents = []
    file_names = []
    
    for file in os.listdir(folder_path):
        if file.endswith('.txt'):
            file_path = os.path.join(folder_path, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                file_contents.append(f.read())
            file_names.append(file)
    
    # Initialize the model
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    # Convert file contents to embeddings
    embeddings = model.encode(file_contents)
    
    # Convert embeddings to float32
    embeddings = np.array(embeddings).astype('float32')
    
    # Create a FAISS index
    index = faiss.IndexFlatL2(embeddings.shape[1])  # L2 distance
    index.add(embeddings)
    
    # Perform similarity search (e.g., find the closest match)
    query_embedding = model.encode([query]).astype('float32')
    
    # Search the index
    D, I = index.search(query_embedding, 1)
    
    return file_contents[I[0][0]]}