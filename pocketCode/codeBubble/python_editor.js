/*

  python lists
  
*/
python_operator_expressions_list=[
			{name:'Dot variable (.variable)', value:'python_dot_variable'},
			{name:'Comma Expression (, expression)',value:'python_comma_expression'},
			{name:'Add Expression (+ expression)',value:'python_addition_expression'},
			{name:'Subtraction Expression (- expression)',value:'python_subtraction_expression'},
			{name:'Multiplication Expression (* expression)',value:'python_multiplication_expression'},
			{name:'Division Expression (/ expression)',value:'python_division_expression'},
			{name:'Remainder Expression (% expression)',value:'python_remainder_expression'},
			{name:'Truncating division Expression (// expression)',value:'python_truncating_division_expression'},
			{name:'Power Expression (** expression)',value:'python_power_expression'},
			{name:'Bitwise or (| expression)',value:'python_bitwise_or_expression'},
			{name:'Bitwise xor (^ expression)',value:'python_bitwise_xor_expression'},
			{name:'Bitwise and (& expression)',value:'python_bitwise_and_expression'},
			{name:'Bitwise not (~ expression)',value:'python_bitwise_not_expression'},
			{name:'Left shift (<< expression)',value:'python_left_shift_expression'},
			{name:'Right shift (>> expression)',value:'python_right_shift_expression'},
			{name:'Wrap in parentheses (expression)',value:'exp_wrap_parentheses'}//
			];
python_comparison_expressions_list = [
			{name:'Equality x==y',value:'python_equality_expression'},
			{name:'Inequality x!=y',value:'python_inequality_expression'},
			{name:'Less Than x&lt;y',value:'python_less_than_expression'},
			{name:'Less Than Or Equal x&lt;=y',value:'python_less_than_equal_expression'},
			{name:'Greater Than x&gt;y',value:'python_greater_than_expression'},
			{name:'Greater Than or Equal x&gt;=y',value:'python_greater_than_equal_expression'},
			{name:'Identity test x is y',value:'python_identity_test_expression'},
			{name:'Not Identity test x is not y',value:'python_not_identity_test_expression'},
			{name:'Membership test x in y',value:'python_membership_test_expression'},
			{name:'Not Membership test x not in y',value:'python_not_membership_test_expression'}
];

python_statements_az_list = [
	{name:'Assignment x = expression',value:'assignment_statement'},
	{name:'print message to output',value:'print_statement'},
	{name:'if expression is true',value:'if_statement'},
	{name:'Comment #This is for humans',value:'statement_add_comment'}
];

/*
 * Statements
 */

function print_statement() {
	insert_statement('print_statement','<span class="cm-keyword">print</span><indentation class="indentation" num="1"> </indentation><span class="unknown-expression">???</span>',2);
}

function if_statement() {
	insert_statement('if_statement','<span class="cm-keyword">if</span><indentation class="indentation" num="1"> </indentation><span class="unknown-expression">???</span><indentation class="indentation" num="1"> </indentation><span class="cm-delimiter">:</span><indentation class="indentation" num="1"> </indentation>',2);
	newline(4);
}

function statement_add_comment() {
	var comment=prompt("Enter the comment line:","");
	var span = createSpan('cm-comment','# '+comment);
	insertBeforeCurrent(span);
	goToPreviousElement(); //goto the comment that was created
}

function assignment_statement() {
	insert_statement('if_statement','<span class="unknown-variable">???</span><indentation class="indentation" num="1"> </indentation><span class="cm-operator"> = </span><indentation class="indentation" num="1"> </indentation><span class="unknown-expression">???</span>',2);
}

/*
 Expressions
*/
function exp_add_format_string() {
	var value=prompt("Enter a string %d=decimal %s=string %f=float %c=character %r=debug","");
	insert_expression('cm-string','"'+value+'"'); 
	python_remainder_expression(); //might aswell reuse remainder for the %
}