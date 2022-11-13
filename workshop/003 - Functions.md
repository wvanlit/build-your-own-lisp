# 003 - Functions

## End Result

```scheme
> (define square (lambda (x) * x x))
> (square 3)
>> 9
> (define add (lambda (x) lambda (y) + x y)) ; First Class function!
> (define add5 (add 5))
> (add5 2)
> 7
```
