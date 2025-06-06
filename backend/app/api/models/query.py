from typing import Generic, Optional, Dict, List, Literal, Any, TypeVar
from pydantic import BaseModel, Field
from pydantic.generics import GenericModel

T = TypeVar("T")
SortOrder = Literal["asc", "desc"]


class PaginationQuery(BaseModel):
    """
    Pagination query parameters.

    Supports standard pagination, filtering, and sorting. The `condition` field supports field suffixes for comparison operations.

    Example:
        {
            "pageIndex": 1,
            "pageSize": 10,
            "condition": {
                "name__icontains": "abc",
                "age": 18
            },
            "sort": {
                "createTime": "asc",
                "age": "desc"
            }
        }

    Attributes:
        pageIndex (int): Page number, starts from 1. Default is 1.
        pageSize (int): Number of items per page. Default is 10.
        condition (dict): Query conditions. Field name can include a suffix for comparison.
        sort (dict): Sorting order. Key is the field name, value is 'asc' or 'desc'.

    Supported field suffix operations:

        | Suffix          | Meaning                        |
        |-----------------|--------------------------------|
        | `__eq`          | Equal to (default)             |
        | `__ne`          | Not equal to                   |
        | `__gt`          | Greater than                   |
        | `__lt`          | Less than                      |
        | `__ge`          | Greater than or equal to       |
        | `__le`          | Less than or equal to          |
        | `__contains`    | Contains (case-sensitive)      |
        | `__icontains`   | Contains (case-insensitive)    |
        | `__startswith`  | Starts with                    |
        | `__istartswith` | Starts with (case-insensitive) |
    """
    pageIndex: int = Field(1, ge=1)
    pageSize: int = Field(10, ge=1)
    condition: Optional[Dict[str, object]] = Field(default_factory=dict)
    sort: Optional[Dict[str, SortOrder]] = Field(default_factory=dict)


class QueryResult(GenericModel, Generic[T]):
    """
    通用分页查询结果，支持结构不固定的列表数据。

    Attributes:
        total (int): 总记录数。
        list (List[Dict[str, Any]]): 当前页的数据列表，每个元素是任意结构的对象。
        pageSize (int): 每页数量。
        pageIndex (int): 当前页码。
    """
    total: int = Field(..., description="总记录数")
    list: List[T] = Field(..., description="当前页数据列表")
    pageSize: int = Field(..., description="每页数量")
    pageIndex: int = Field(..., description="当前页码")
