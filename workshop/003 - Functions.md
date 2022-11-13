# 003 - Functions

[ [previous step](./002%20-%20Variables.md) | [next step](./004%20-%20Next%20Steps.md) ]

## End Result

```scheme
» (define square (lambda (x) * x x))
» (square 3)
9
» (define add (lambda (x) lambda (y) + x y)) ; First Class function!
» (define add5 (add 5))
» (add5 2)
7
» (define isFive (lambda (x) if (= x 5) "yes" "no"))
» ((isFive 2) (isFive 5) (isFive 55))
[ 'no', 'yes', 'no', ]
```

#
