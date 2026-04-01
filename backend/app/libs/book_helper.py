class BookHelper:
    @staticmethod
    def build_book_path(sha1: str):
        """
        Two-Level Hashed Directory Tree
        1. Performance & Scalability (O(1) Access)
        2. Predictable & Permanent URLs
        3. Storage Load Balancing
        :param sha1: Book SHA-1 Hash
        :return:
        """
        l1 = sha1[0:2]
        l2 = sha1[2:4]
        return f"book/{l1}/{l2}/{sha1}"
